import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

/* ===============================
   Helpers
================================ */

const getCollectionsRef = (subjectId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  return collection(
    db,
    'users',
    user.uid,
    'subjects',
    subjectId,
    'collections'
  );
};

const getSubjectDocRef = (subjectId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  return doc(db, 'users', user.uid, 'subjects', subjectId);
};

const getCollectionDocRef = (subjectId, collectionId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  return doc(
    db,
    'users',
    user.uid,
    'subjects',
    subjectId,
    'collections',
    collectionId
  );
};

/* ===============================
   Reset Progress (FIXED)
================================ */

export const resetCollectionProgress = async (subjectId, collectionId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const ref = doc(
    db,
    'users',
    user.uid,
    'subjects',
    subjectId,
    'collections',
    collectionId
  );

  await updateDoc(ref, {
    progress: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    completed: 0,
    updatedAt: new Date(),
  });
};


/* ===============================
   Create
================================ */

export const addCollection = async (subjectId, name) => {
  const collectionsRef = getCollectionsRef(subjectId);

  const newCollection = {
    name: name.trim(),
    cards: 0,
    completed: 0,
    progress: { easy: 0, medium: 0, hard: 0 },
    createdAt: new Date(),
  };

  const docRef = await addDoc(collectionsRef, newCollection);

  const subjectRef = getSubjectDocRef(subjectId);
  const snap = await getDoc(subjectRef);
  const count = snap.exists() ? snap.data().collectionCount || 0 : 0;

  await updateDoc(subjectRef, {
    collectionCount: count + 1,
  });

  return { id: docRef.id, ...newCollection };
};

/* ===============================
   Read
================================ */

export const fetchCollections = async (subjectId) => {
  const snapshot = await getDocs(getCollectionsRef(subjectId));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getCollectionById = async (subjectId, collectionId) => {
  const snap = await getDoc(getCollectionDocRef(subjectId, collectionId));
  if (!snap.exists()) throw new Error('Collection not found');
  return { id: snap.id, ...snap.data() };
};

/* ===============================
   Update Progress (SAFE)
================================ */

export const updateCollectionProgress = async (
  subjectId,
  collectionId,
  difficulty
) => {
  if (!['easy', 'medium', 'hard'].includes(difficulty)) return;

  const ref = getCollectionDocRef(subjectId, collectionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  const progress = {
    easy: Number(data.progress?.easy ?? 0),
    medium: Number(data.progress?.medium ?? 0),
    hard: Number(data.progress?.hard ?? 0),
  };

  progress[difficulty] += 1;

  await updateDoc(ref, {
    progress,
    completed: (data.completed ?? 0) + 1,
    updatedAt: new Date(),
  });
};
