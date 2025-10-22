import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, View } from 'react-native';
import SubjectHeader from '../../../../../components/layout/SubjectHeader';
import Button from '../../../../../components/ui/Button';
import FlashcardCard from '../../../../../components/ui/FlashcardCard';
import ProgressBar from '../../../../../components/ui/ProgressBar';
import { getCollectionById, getSubjectById } from '../../../../../constants/mockData';

export default function StudyModeScreen() {
  const router = useRouter();
  const { subjectId, collectionId } = useLocalSearchParams();

  const subject = getSubjectById(subjectId);
  const collection = getCollectionById(subjectId, collectionId);
  const flashcards = collection?.flashcards || [];

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

  const handleNext = () => {
    if (currentIndex < total - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      // Study session complete - go back to collection
      router.back();
    }
  };

  if (!subject || !collection || flashcards.length === 0) {
    return (
      <View style={styles.screen}>
        <SubjectHeader
          subject={subject || { name: 'Unknown', icon: 'book-outline', headerColor: '#4F46E5' }}
          collectionCount={0}
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

      {/* Subject header */}
      <SubjectHeader subject={subject} collectionCount={total} onBackPress={() => router.back()} />

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
            onPress={handleNext}
            style={[styles.btn, { backgroundColor: '#dcbb26ff' }]}
          />
          <Button
            title="Hard"
            onPress={handleNext}
            style={[styles.btn, { backgroundColor: '#c81616ff' }]}
          />
        </View>

        <View style={styles.row}>
          <Button
            title="Medium"
            onPress={handleNext}
            style={[styles.btn, { backgroundColor: '#dbeb50ff' }]}
          />
          <Button
            title="Easy"
            onPress={handleNext}
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
