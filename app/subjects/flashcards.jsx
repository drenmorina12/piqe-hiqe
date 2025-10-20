import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import SubjectHeader from "../../components/layout/SubjectHeader";
import Button from "../../components/ui/Button";
import FlashcardCard from "../../components/ui/FlashcardCard";
import ProgressBar from "../../components/ui/ProgressBar";

const flashcards = [
  {
    id: 1,
    question: "What is the Pythagorean theorem?",
    answer:
      "a² + b² = c²\n\nIn a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
  },
  {
    id: 2,
    question: "What is the derivative of x²?",
    answer: "2x\n\nUsing the power rule: d/dx(xⁿ) = nxⁿ⁻¹",
  },
  {
    id: 3,
    question: "What is the quadratic formula?",
    answer:
      "x = (-b ± √(b² - 4ac)) / 2a\n\nUsed to solve equations of the form ax² + bx + c = 0",
  },
];

export default function FlashcardsScreen() {
  const router = useRouter();
  const { subjectId, collectionId } = useLocalSearchParams();

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
      router.replace(`/subjects/${subjectId}`);
    }
  };

  return (
    <View style={styles.screen}>
          <StatusBar barStyle="light-content" />

      {/* Subject header */}
      <SubjectHeader
        subject={{
          name: "Mathematics",
          icon: "book-outline",
          headerColor: "#f090dbff",
        }}
        collectionCount={total}
        onBackPress={() => router.replace(`/subjects/${subjectId}`)}
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
            onPress={handleNext}
            style={[styles.btn, { backgroundColor: "#dcbb26ff" }]}
          />
          <Button
            title="Hard"
            onPress={handleNext}
            style={[styles.btn, { backgroundColor: "#c81616ff" }]}
          />
        </View>

        <View style={styles.row}>
          <Button
            title="Medium"
            onPress={handleNext}
            style={[styles.btn, { backgroundColor: "#dbeb50ff" }]}
          />
          <Button
            title="Easy"
            onPress={handleNext}
            style={[styles.btn, { backgroundColor: "rgba(124, 238, 85, 1)" }]}
          />
        </View>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },
  progressWrap: { marginTop: 8, marginHorizontal: 16 },
  buttonsContainer: { paddingHorizontal: 16, paddingBottom: 16, marginBottom: 20 },
  row: { flexDirection: "row", gap: 12, marginTop: 8 },
  btn: {
    height: 56,
    flex: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
