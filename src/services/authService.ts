import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const getKoreanError = (code: string): string => {
  const messages: Record<string, string> = {
    'auth/email-already-in-use':  '이미 사용 중인 이메일입니다.',
    'auth/invalid-email':         '올바른 이메일 형식이 아닙니다.',
    'auth/weak-password':         '비밀번호는 6자 이상이어야 합니다.',
    'auth/user-not-found':        '존재하지 않는 계정입니다.',
    'auth/wrong-password':        '비밀번호가 틀렸습니다.',
    'auth/invalid-credential':    '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/too-many-requests':     '잠시 후 다시 시도해주세요.',
    'auth/network-request-failed':'네트워크 연결을 확인해주세요.',
  };
  return messages[code] ?? '오류가 발생했습니다. 다시 시도해주세요.';
};

export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<void> => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await setDoc(doc(db, 'stylist_users', user.uid), {
      uid:         user.uid,
      email,
      displayName,
      createdAt:   serverTimestamp(),
    });
  } catch (err) {
    throw new Error(getKoreanError((err as AuthError).code));
  }
};

export const signIn = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw new Error(getKoreanError((err as AuthError).code));
  }
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};
