import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Button from "./Button";

const { width, height } = Dimensions.get("window");

export default function FlashcardCard({ question, answer, revealed, onReveal }) {
  const { colors } = useTheme();

  const accent = colors.primary ?? colors.tint ?? "#4F46E5"; // ✅ e njejta per te dyja

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: colors.card ?? colors.background ?? "#FFFFFF" }]}>
        <Text style={[styles.label, { color: accent }]}>Pyetje</Text>
        <Text style={[styles.question, { color: colors.text ?? "#111827" }]}>{question}</Text>

        {revealed ? (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border ?? "#E5E7EB" }]} />
            <Text style={[styles.label, { color: "#06B6D4" }]}>Përgjigje</Text>
            <Text style={[styles.answer, { color: colors.text ?? "#111827" }]}>{answer}</Text>
          </>
        ) : (
          <View style={{ marginTop: 32 }}>
            <Button
              title="Trego përgjigjen"
              onPress={onReveal}
              style={[styles.showButton, { backgroundColor: accent }]} // ✅ e njejta ngjyre
              textStyle={[styles.showButtonText, { color: "#FFFFFF" }]}
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
    paddingVertical: 15,
    alignItems: "center",
  },
  card: {
    width: width * 0.89,
    minHeight: height * 0.5,
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
