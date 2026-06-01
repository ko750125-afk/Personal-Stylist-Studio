import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  collection, addDoc, deleteDoc, doc,
  serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { storage, db } from '../firebase';

export interface UploadResult {
  downloadUrl:  string;
  storagePath:  string;
  docId:        string;
}

/** 이미지 압축: 최대 1024px, 500KB 이하, 품질 0.75 */
export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB:        0.5,
    maxWidthOrHeight: 1024,
    useWebWorker:     true,
    initialQuality:   0.75,
    fileType:         'image/jpeg' as const,
  };
  const compressed = await imageCompression(file, options);
  console.log(`[Storage] 압축 완료: ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB`);
  return compressed;
};

/**
 * 이미지 압축 → Firebase Storage 업로드 → Firestore에 메타데이터 기록
 * 경로: users/{uid}/styles/{timestamp}.jpg
 */
export const uploadStyleImage = async (uid: string, file: File): Promise<UploadResult> => {
  const compressed   = await compressImage(file);
  const timestamp    = Date.now();
  const storagePath  = `users/${uid}/styles/${timestamp}.jpg`;
  const storageRef   = ref(storage, storagePath);

  await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
  const downloadUrl = await getDownloadURL(storageRef);

  // Firestore에 메타데이터 기록 (30일 후 만료 추적용)
  const expiresAt = Timestamp.fromDate(new Date(timestamp + 30 * 24 * 60 * 60 * 1000));
  const docRef = await addDoc(collection(db, 'stylist_images'), {
    uid,
    storagePath,
    downloadUrl,
    uploadedAt: serverTimestamp(),
    expiresAt,
  });

  return { downloadUrl, storagePath, docId: docRef.id };
};

/** Storage + Firestore 동시 삭제 */
export const deleteStyleImage = async (storagePath: string, docId: string): Promise<void> => {
  await deleteObject(ref(storage, storagePath));
  await deleteDoc(doc(db, 'stylist_images', docId));
};
