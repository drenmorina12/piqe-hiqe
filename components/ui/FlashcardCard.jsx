import { Dimensions, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

const { width, height } = Dimensions.get("window");

export default function FlashcardCard({ question, answer, revealed, onReveal }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={[styles.label, { color: "#4F46E5" }]}>Question</Text>
        <Text style={styles.question}>{question}</Text>

        {revealed ? (
          <>
            <View style={styles.divider} />
            <Text style={[styles.label, { color: "#06B6D4" }]}>Answer</Text>
            <Text style={styles.answer}>{answer}</Text>
          </>
        ) : (
          <View style={{ marginTop: 32 }}>
            <Button
              title="Show Answer"
              onPress={onReveal}
              style={styles.showButton}
              textStyle={styles.showButtonText}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width,
    paddingVertical: 40,
    alignItems: "center",
  },
  card: {
    width: width * 0.85, 
    minHeight: height * 0.55, 
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "600",
  },
  question: {
    color: "#111827",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
  },
  answer: {
    color: "#111827",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    alignSelf: "stretch",
    marginVertical: 24,
  },
  showButton: {
    backgroundColor: "rgba(166, 167, 246, 1)",
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 32,
  },
  showButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
