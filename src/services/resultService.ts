import {
  collection, addDoc, query, where, orderBy, getDocs,
  serverTimestamp, doc, deleteDoc, Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import type { BodyAnalysisResult } from './openaiService';
import { uploadStyleImage, deleteStyleImage, uploadBase64Image } from './storageService';

// ─── Types ──────────────────────────────────────────────────────
export interface SavedResult {
  docId: string;
  uid: string;
  result: BodyAnalysisResult;
  photoUrl: string;
  photoStoragePath: string;
  photoDocId: string;
  outfitImages: (string | null)[];
  createdAt: Date;
  expiresAt: Date;
}

// ─── Save ───────────────────────────────────────────────────────
/**
 * 분석 결과를 Firestore에 저장하고 사진 및 생성된 가상 모델 코디샷을 Storage에 업로드
 */
export async function saveAnalysisResult(
  uid: string,
  result: BodyAnalysisResult,
  photoFile: File,
  outfitImages?: (string | null)[]
): Promise<SavedResult> {
  // 1. 사용자 사진 업로드 (압축 → Storage → 메타데이터)
  const upload = await uploadStyleImage(uid, photoFile);

  const outfitUrls = outfitImages || [];

  // 2. 가상 아바타 이미지들 중 Base64는 Storage에 업로드하여 퍼블릭 URL 획득
  const uploadedOutfitUrls = await Promise.all(
    outfitUrls.map(async (img) => {
      if (!img) return null;
      if (img.startsWith('data:')) {
        // Base64 형식은 Storage 업로드
        return await uploadBase64Image(uid, img, 'outfits');
      }
      // 일반 URL (Pollinations.ai)은 그대로 보존
      return img;
    })
  );

  // 3. 만료 날짜 계산 (2주 = 14일)
  const timestamp = Date.now();
  const expiresAtDate = new Date(timestamp + 14 * 24 * 60 * 60 * 1000);
  const expiresAt = Timestamp.fromDate(expiresAtDate);

  // 4. 분석 결과 Firestore에 저장
  const docRef = await addDoc(collection(db, 'stylist_results'), {
    uid,
    result,
    photoUrl: upload.downloadUrl,
    photoStoragePath: upload.storagePath,
    photoDocId: upload.docId,
    outfitImages: uploadedOutfitUrls,
    createdAt: serverTimestamp(),
    expiresAt,
  });

  return {
    docId: docRef.id,
    uid,
    result,
    photoUrl: upload.downloadUrl,
    photoStoragePath: upload.storagePath,
    photoDocId: upload.docId,
    outfitImages: uploadedOutfitUrls,
    createdAt: new Date(),
    expiresAt: expiresAtDate,
  };
}

// ─── Load ───────────────────────────────────────────────────────
/**
 * 유저의 분석 결과 히스토리 조회 (최신순)
 */
export async function loadAnalysisHistory(uid: string): Promise<SavedResult[]> {
  const q = query(
    collection(db, 'stylist_results'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      docId: d.id,
      uid: data.uid,
      result: data.result as BodyAnalysisResult,
      photoUrl: data.photoUrl,
      photoStoragePath: data.photoStoragePath,
      photoDocId: data.photoDocId,
      outfitImages: data.outfitImages || [],
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      expiresAt: data.expiresAt?.toDate?.() ?? new Date(),
    };
  });
}

// ─── Delete ─────────────────────────────────────────────────────
/**
 * 분석 결과 + 연결된 이미지 모두 삭제
 */
export async function deleteAnalysisResult(saved: SavedResult): Promise<void> {
  // Storage + stylist_images 메타 삭제
  await deleteStyleImage(saved.photoStoragePath, saved.photoDocId);
  // stylist_results 문서 삭제
  await deleteDoc(doc(db, 'stylist_results', saved.docId));
}
