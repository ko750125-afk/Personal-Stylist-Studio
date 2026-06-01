import {
  collection, addDoc, query, where, orderBy, getDocs,
  serverTimestamp, doc, deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { BodyAnalysisResult } from './openaiService';
import { uploadStyleImage, deleteStyleImage } from './storageService';

// ─── Types ──────────────────────────────────────────────────────
export interface SavedResult {
  docId: string;
  uid: string;
  result: BodyAnalysisResult;
  photoUrl: string;
  photoStoragePath: string;
  photoDocId: string;
  createdAt: Date;
}

// ─── Save ───────────────────────────────────────────────────────
/**
 * 분석 결과를 Firestore에 저장하고 사진을 Storage에 업로드
 */
export async function saveAnalysisResult(
  uid: string,
  result: BodyAnalysisResult,
  photoFile: File
): Promise<SavedResult> {
  // 1. 사진 업로드 (압축 → Storage → 메타데이터)
  const upload = await uploadStyleImage(uid, photoFile);

  // 2. 분석 결과 Firestore에 저장
  const docRef = await addDoc(collection(db, 'stylist_results'), {
    uid,
    result,
    photoUrl: upload.downloadUrl,
    photoStoragePath: upload.storagePath,
    photoDocId: upload.docId,
    createdAt: serverTimestamp(),
  });

  return {
    docId: docRef.id,
    uid,
    result,
    photoUrl: upload.downloadUrl,
    photoStoragePath: upload.storagePath,
    photoDocId: upload.docId,
    createdAt: new Date(),
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
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
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
