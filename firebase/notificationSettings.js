import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// ===============================
// GET
// ===============================
export async function getUserNotificationsEnabled(uid) {
  const ref = doc(db, 'users', uid, 'settings', 'preferences');
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return false;
  }

  return snap.data().notificationsEnabled === true;
}

// ===============================
// SET
// ===============================
export async function setUserNotificationsEnabled(uid, value) {
  const ref = doc(db, 'users', uid, 'settings', 'preferences');

  await setDoc(
    ref,
    { notificationsEnabled: value },
    { merge: true }
  );
}
