
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

// Path: users/{uid}/subjects/{subjectId}/collections
const getCollectionsRef = (subjectId) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  return collection(db, 'users', user.uid, 'subjects', subjectId, 'collections');
};

const getSubjectDocRef = (subjectId) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  return doc(db, 'users', user.uid, 'subjects', subjectId);
};


const getCurrentCollectionCount = async (subjectId) => {
  const subjectRef = getSubjectDocRef(subjectId);
  const snap = await getDoc(subjectRef);

  if (!snap.exists()) return 0;

  const data = snap.data();
  return typeof data.collectionCount === 'number' ? data.collectionCount : 0;
};

// CREATE
export const addCollection = async (subjectId, name) => {
  const collectionsRef = getCollectionsRef(subjectId);

  const newCollection = {
    name: name.trim(),
    cards: 0,
    completed: 0,
    createdAt: new Date(),
  };

  const docRef = await addDoc(collectionsRef, newCollection);

  const subjectRef = getSubjectDocRef(subjectId);
  const current = await getCurrentCollectionCount(subjectId);
  const next = current + 1;
  await updateDoc(subjectRef, {
    collectionCount: next,
  });

  return { id: docRef.id, ...newCollection };
};

// READ ALL
export const fetchCollections = async (subjectId) => {
  const collectionsRef = getCollectionsRef(subjectId);
  const snapshot = await getDocs(collectionsRef);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

// READ ONE (nëse të duhet)
export const getCollectionById = async (subjectId, collectionId) => {
  const collectionsRef = getCollectionsRef(subjectId);
  const docSnap = await getDoc(doc(collectionsRef, collectionId));

  if (!docSnap.exists()) {
    throw new Error('Collection not found');
  }

  return { id: docSnap.id, ...docSnap.data() };
};

// UPDATE (p.sh. emri i koleksionit)
export const updateCollection = async (subjectId, collectionId, updates) => {
  const collectionsRef = getCollectionsRef(subjectId);
  const collectionDoc = doc(collectionsRef, collectionId);

  await updateDoc(collectionDoc, {
    ...updates,
    updatedAt: new Date(),
  });
};

// DELETE
export const deleteCollection = async (subjectId, collectionId) => {
  const collectionsRef = getCollectionsRef(subjectId);
  const collectionDoc = doc(collectionsRef, collectionId);

  await deleteDoc(collectionDoc);

  // ➜ zvogëlo collectionCount në subject doc, por kurrë nën 0
  const subjectRef = getSubjectDocRef(subjectId);
  const current = await getCurrentCollectionCount(subjectId);
  const next = current > 0 ? current - 1 : 0;

  await updateDoc(subjectRef, {
    collectionCount: next,
  });
};
