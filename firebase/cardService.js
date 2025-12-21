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

// Path: users/{uid}/subjects/{subjectId}/collections/{collectionId}/cards
const getCardsRef = (subjectId, collectionId) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  return collection(
    db,
    'users',
    user.uid,
    'subjects',
    subjectId,
    'collections',
    collectionId,
    'cards'
  );
};

const getCollectionDocRef = (subjectId, collectionId) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  return doc(db, 'users', user.uid, 'subjects', subjectId, 'collections', collectionId);
};

const getCurrentCardCount = async (subjectId, collectionId) => {
  const collectionRef = getCollectionDocRef(subjectId, collectionId);
  const snap = await getDoc(collectionRef);

  if (!snap.exists()) return 0;

  const data = snap.data();
  return typeof data.cards === 'number' ? data.cards : 0;
};

const getCurrentCompletedCount = async (subjectId, collectionId) => {
  const collectionRef = getCollectionDocRef(subjectId, collectionId);
  const snap = await getDoc(collectionRef);

  if (!snap.exists()) return 0;

  const data = snap.data();
  return typeof data.completed === 'number' ? data.completed : 0;
};

// CREATE
export const addCard = async (subjectId, collectionId, card) => {
  const cardsRef = getCardsRef(subjectId, collectionId);

  const newCard = {
    question: (card.question || card.front || '').trim(),
    answer: (card.answer || card.back || '').trim(),
    hint: card.hint ?? '',
    difficulty: card.difficulty ?? null,
    completed: !!card.completed,
    createdAt: new Date(),
  };

  const docRef = await addDoc(cardsRef, newCard);

  // increment parent collection card count
  const collectionRef = getCollectionDocRef(subjectId, collectionId);
  const current = await getCurrentCardCount(subjectId, collectionId);
  const next = current + 1;
  await updateDoc(collectionRef, { cards: next });

  // if the card is already marked completed, increment completed counter as well
  if (newCard.completed) {
    const currentCompleted = await getCurrentCompletedCount(subjectId, collectionId);
    await updateDoc(collectionRef, { completed: currentCompleted + 1 });
  }

  return { id: docRef.id, ...newCard };
};

// READ ALL
export const fetchCards = async (subjectId, collectionId) => {
  const cardsRef = getCardsRef(subjectId, collectionId);
  const snapshot = await getDocs(cardsRef);

  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// READ ONE
export const getCardById = async (subjectId, collectionId, cardId) => {
  const cardsRef = getCardsRef(subjectId, collectionId);
  const cardDoc = await getDoc(doc(cardsRef, cardId));

  if (!cardDoc.exists()) {
    throw new Error('Card not found');
  }

  return { id: cardDoc.id, ...cardDoc.data() };
};

// UPDATE
// If updates contain `completed`, adjust the parent collection's completed count accordingly.
export const updateCard = async (subjectId, collectionId, cardId, updates) => {
  const cardsRef = getCardsRef(subjectId, collectionId);
  const cardDocRef = doc(cardsRef, cardId);

  // If completed status may change, read previous value
  let prevCompleted = null;
  if (Object.prototype.hasOwnProperty.call(updates, 'completed')) {
    const prevSnap = await getDoc(cardDocRef);
    if (!prevSnap.exists()) throw new Error('Card not found');
    prevCompleted = !!prevSnap.data().completed;
  }

  const cleanUpdates = { ...updates };
if (cleanUpdates.difficulty === 'repeat') {
  delete cleanUpdates.difficulty;
}

await updateDoc(cardDocRef, {
  ...cleanUpdates,
  updatedAt: new Date(),
});


  if (prevCompleted !== null) {
    const newCompleted = !!updates.completed;
    if (newCompleted !== prevCompleted) {
      const collectionRef = getCollectionDocRef(subjectId, collectionId);
      const currentCompleted = await getCurrentCompletedCount(subjectId, collectionId);
      const nextCompleted = newCompleted ? currentCompleted + 1 : Math.max(currentCompleted - 1, 0);
      await updateDoc(collectionRef, { completed: nextCompleted });
    }
  }
};

// DELETE
export const deleteCard = async (subjectId, collectionId, cardId) => {
  const cardsRef = getCardsRef(subjectId, collectionId);
  const cardDocRef = doc(cardsRef, cardId);

  // read whether card was completed so we can adjust counts
  const snap = await getDoc(cardDocRef);
  if (!snap.exists()) throw new Error('Card not found');
  const wasCompleted = !!snap.data().completed;

  await deleteDoc(cardDocRef);

  // decrement parent collection cards count (never below 0)
  const collectionRef = getCollectionDocRef(subjectId, collectionId);
  const current = await getCurrentCardCount(subjectId, collectionId);
  const next = current > 0 ? current - 1 : 0;
  await updateDoc(collectionRef, { cards: next });

  // decrement completed if necessary
  if (wasCompleted) {
    const currentCompleted = await getCurrentCompletedCount(subjectId, collectionId);
    const nextCompleted = currentCompleted > 0 ? currentCompleted - 1 : 0;
    await updateDoc(collectionRef, { completed: nextCompleted });
  }
};

export const resetCardsDifficulty = async (subjectId, collectionId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const cardsRef = collection(
    db,
    'users',
    user.uid,
    'subjects',
    subjectId,
    'collections',
    collectionId,
    'cards'
  );

  const snap = await getDocs(cardsRef);

  const updates = snap.docs.map((d) =>
    updateDoc(d.ref, {
      difficulty: null,
      completed: false,
    })
  );

  await Promise.all(updates);
};



// ➜ SHTESË: krijo një kartë nga API duke përdorur logjikën ekzistuese të addCard
export const addCardFromApi = async (
  subjectId,
  collectionId,
  { question, answer, source }
) => {
  // thjesht përdorim addCard që ke tashmë,
  // në mënyrë që të punojnë automatikisht edhe counters (cards/completed)
  return addCard(subjectId, collectionId, {
    question,
    answer,
    hint: `Imported from ${source || 'API'}`,
    difficulty: null,
    completed: false,
  });
};

