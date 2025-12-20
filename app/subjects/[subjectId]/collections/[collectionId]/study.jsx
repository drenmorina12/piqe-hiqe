import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import Header from '../../../../../components/layout/Header';
import Button from '../../../../../components/ui/Button';
import FlashcardCard from '../../../../../components/ui/FlashcardCard';
import ProgressBar from '../../../../../components/ui/ProgressBar';
import { fetchCards, updateCard } from '../../../../../firebase/cardService';
import { getCollectionById as fetchCollectionById } from '../../../../../firebase/collectionService';
import { getSubjectById as fetchSubjectById } from '../../../../../firebase/subjectService';

export default function StudyModeScreen() {
  const router = useRouter();
  const { subjectId, collectionId } = useLocalSearchParams();

  const [subject, setSubject] = useState(null);
  const [collection, setCollection] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const subj = await fetchSubjectById(String(subjectId));
        setSubject(subj);
        const coll = await fetchCollectionById(String(subjectId), String(collectionId));
        setCollection(coll);
        const cards = await fetchCards(String(subjectId), String(collectionId));
        setFlashcards(cards);
      } catch (err) {
        console.log('Error loading study data:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [subjectId, collectionId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState({});
  const flatRef = useRef(null);

  const total = flashcards.length;
  const progress = useMemo(() => currentIndex + 1, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) {
      const next = viewableItems[0].index ?? 0;
      setCurrentIndex(next);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 80,
  }).current;

  const handleReveal = (id) => setRevealed((r) => ({ ...r, [id]: true }));

  const handleDifficulty = async (difficulty) => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    try {
      await updateCard(String(subjectId), String(collectionId), currentCard.id, {
        difficulty,
      });
      // Update local state
      setFlashcards((prev) =>
        prev.map((card) => (card.id === currentCard.id ? { ...card, difficulty } : card))
      );
    } catch (err) {
      console.log('Error updating card difficulty:', err);
    }

    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      // Study session complete - go back to collection
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={subject?.headerColor || '#e5c046ff'}
          title="Loading..."
          subtitle=""
          icon="book-outline"
          showBack
          showHome
          onBackPress={() => router.back()}
        />
        <View style={styles.emptyContainer}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (!subject || !collection || flashcards.length === 0) {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={subject?.headerColor || '#e5c046ff'}
          title={subject?.name || "Study"}
          subtitle=""
          icon={subject?.icon || "book-outline"}
          showBack
          showHome
          onBackPress={() => router.back()}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No flashcards to study</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/*  Header */}
      <Header
        backgroundColor={subject.headerColor}
        title={collection.name}
        subtitle={`${total} flashcard${total === 1 ? "" : "s"}`}
        icon={subject.icon}
        showBack
        showHome
        onBackPress={() => router.back()}
      />

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <ProgressBar value={progress / total} />
      </View>

      {/* Flashcards */}
      <FlatList
        ref={flatRef}
        data={flashcards}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FlashcardCard
            question={item.question}
            answer={item.answer}
            revealed={!!revealed[item.id]}
            onReveal={() => handleReveal(item.id)}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Action buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button
            title="Repeat"
            onPress={() => handleDifficulty('repeat')}
            style={[styles.btn, { backgroundColor: '#dcbb26ff' }]}
          />
          <Button
            title="Hard"
            onPress={() => handleDifficulty('hard')}
            style={[styles.btn, { backgroundColor: '#c81616ff' }]}
          />
        </View>

        <View style={styles.row}>
          <Button
            title="Medium"
            onPress={() => handleDifficulty('medium')}
            style={[styles.btn, { backgroundColor: '#dbeb50ff' }]}
          />
          <Button
            title="Easy"
            onPress={() => handleDifficulty('easy')}
            style={[styles.btn, { backgroundColor: 'rgba(124, 238, 85, 1)' }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  progressWrap: { marginTop: 8, marginHorizontal: 16 },
  buttonsContainer: { paddingHorizontal: 16, paddingBottom: 16, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: {
    height: 56,
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
  },
});
