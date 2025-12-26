import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Header from '../../../../../components/layout/Header';
import Button from '../../../../../components/ui/Button';
import FlashcardCard from '../../../../../components/ui/FlashcardCard';
import ProgressBar from '../../../../../components/ui/ProgressBar';

import StudyCompleteModal from '../../../../../components/ui/StudyCompleteModal';
import { fetchCards, updateCard } from '../../../../../firebase/cardService';
import {
  getCollectionById as fetchCollectionById,
  updateCollectionProgress,
} from '../../../../../firebase/collectionService';
import { getSubjectById as fetchSubjectById } from '../../../../../firebase/subjectService';


const CARD_WIDTH = Dimensions.get('window').width;

export default function StudyModeScreen() {
  const router = useRouter();
  const { subjectId, collectionId } = useLocalSearchParams();

  const [subject, setSubject] = useState(null);
  const [collection, setCollection] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studyCompleted, setStudyCompleted] = useState(false);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState({});
  const [sessionProgress, setSessionProgress] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const flatRef = useRef(null);
  const isNavigatingRef = useRef(false);

  const scrollTo = (index) => {
  if (!flatRef.current) return;

  if (Platform.OS === 'web') {
    flatRef.current.scrollToOffset({
      offset: index * CARD_WIDTH,
      animated: true,
    });
  } else {
    flatRef.current.scrollToIndex({
      index,
      animated: true,
    });
  }
};

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setCurrentIndex(0);
        setRevealed({});
        setSessionProgress({ easy: 0, medium: 0, hard: 0 });

        const subj = await fetchSubjectById(String(subjectId));
        const coll = await fetchCollectionById(
          String(subjectId),
          String(collectionId)
        );
        const cards = await fetchCards(
          String(subjectId),
          String(collectionId)
        );

        setSubject(subj);
        setCollection(coll);
        setFlashcards(cards);
      } catch (err) {
        console.log('Gabim gjatë ngarkimit të të dhënave të studimit:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [subjectId, collectionId]);

  const total = flashcards.length;
  const progress = useMemo(() => currentIndex + 1, [currentIndex]);

  /* ================= HELPERS ================= */

  const handleReveal = (id) => {
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const goNext = () => {
  if (currentIndex < total - 1) {
    const nextIndex = currentIndex + 1;

    isNavigatingRef.current = true;
    setCurrentIndex(nextIndex);

    requestAnimationFrame(() => {
      scrollTo(nextIndex);
      isNavigatingRef.current = false;
    });
  } else {
  setStudyCompleted(true);
}

};


  const handleDifficulty = async (difficulty) => {
  if (isNavigatingRef.current) return;

  const currentCard = flashcards[currentIndex];
  if (!currentCard) return;

  if (difficulty === 'repeat') {
  setRevealed((prev) => ({
    ...prev,
    [currentCard.id]: false,
  }));
  return; 
}


  const hadDifficultyBefore = !!currentCard.difficulty;

  try {
    await updateCard(
      String(subjectId),
      String(collectionId),
      currentCard.id,
      { difficulty }
    );

    if (!hadDifficultyBefore) {
      await updateCollectionProgress(
        String(subjectId),
        String(collectionId),
        difficulty
      );
    }

    setSessionProgress((prev) => ({
      ...prev,
      [difficulty]: prev[difficulty] + 1,
    }));

    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === currentCard.id ? { ...card, difficulty } : card
      )
    );
  } catch (err) {
    console.log('Gabim gjatë vështirësisë së përditësimit:', err);
  }

  goNext();
};


  /* ================= RENDER ================= */

  if (loading) {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={subject?.headerColor || '#4F46E5'}
          title="Loading..."
          icon="book-outline"
          showBack
          showHome
        />
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (!subject || !collection || flashcards.length === 0) {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={subject?.headerColor || '#4F46E5'}
          title={subject?.name || 'Study'}
          icon={subject?.icon || 'book-outline'}
          showBack
          showHome
        />
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nuk ka karta për të studiuar</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <Header
        backgroundColor={subject.headerColor}
        title={collection.name}
        subtitle={`${total} ${total === 1 ? 'karte' : 'kartat'}`}
        icon={subject.icon}
        showBack
        showHome
      />

      <View style={styles.progressWrap}>
        <ProgressBar value={progress / total} />
      </View>
      <StudyCompleteModal
  visible={studyCompleted}
  onClose={() => {
    setStudyCompleted(false);
    router.replace(
      `/subjects/${subjectId}/collections/${collectionId}`
    );
  }}
/>


      <FlatList
        ref={flatRef}
        data={flashcards}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled={Platform.OS !== 'web'}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <FlashcardCard
            question={item.question}
            answer={item.answer}
            revealed={!!revealed[item.id]}
            onReveal={() => handleReveal(item.id)}
          />
        )}
        style={{ flexGrow: 0 }}
      />

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button
            title="Përsërit"
            onPress={() => handleDifficulty('repeat')}
            style={[styles.btn, { backgroundColor: '#5094e7ff' }]}
          />
          <Button
            title="Vështirë"
            onPress={() => handleDifficulty('hard')}
            style={[styles.btn, { backgroundColor: '#EF4444' }]}
          />
        </View>

        <View style={styles.row}>
          <Button
            title="Mesme"
            onPress={() => handleDifficulty('medium')}
            style={[styles.btn, { backgroundColor: '#FACC15' }]}
          />
          <Button
            title="Lehtë"
            onPress={() => handleDifficulty('easy')}
            style={[styles.btn, { backgroundColor: '#22C55E' }]}
          />
        </View>
      </View>
    </View>
    
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  progressWrap: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'web' ? 24 : 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    height: 56,
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
  },
});
