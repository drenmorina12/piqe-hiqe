
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// Path: users/{uid}/subjects
const getSubjectsCollectionRef = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  return collection(db, 'users', user.uid, 'subjects');
};

// CREATE
export const addSubject = async (name) => {
  const subjectsRef = getSubjectsCollectionRef();

  const newSubject = {
    name: name.trim(),
    icon: 'book',
    iconBackgroundColor: '#E0F2FE',
    headerColor: '#3B82F6',
    collectionCount: 0,       // ➜ numri i collections fillon 0
    createdAt: new Date(),
  };

  const docRef = await addDoc(subjectsRef, newSubject);
  return { id: docRef.id, ...newSubject };
};

// READ ALL
export const fetchSubjects = async () => {
  const subjectsRef = getSubjectsCollectionRef();
  const snapshot = await getDocs(subjectsRef);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

// READ ONE
export const getSubjectById = async (subjectId) => {
  const subjectsRef = getSubjectsCollectionRef();
  const subjectDoc = await getDoc(doc(subjectsRef, subjectId));

  if (!subjectDoc.exists()) {
    throw new Error('Subject not found');
  }

  return { id: subjectDoc.id, ...subjectDoc.data() };
};

// UPDATE (p.sh. name, collectionCount, etj.)
export const updateSubject = async (subjectId, updates) => {
  const subjectsRef = getSubjectsCollectionRef();
  const subjectDoc = doc(subjectsRef, subjectId);

  await updateDoc(subjectDoc, {
    ...updates,
    updatedAt: new Date(),
  });
};

// DELETE
export const deleteSubject = async (subjectId) => {
  const subjectsRef = getSubjectsCollectionRef();
  const subjectDoc = doc(subjectsRef, subjectId);
  await deleteDoc(subjectDoc);
};
