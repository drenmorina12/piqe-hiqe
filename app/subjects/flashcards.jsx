import { StyleSheet, Text, View } from 'react-native';

export default function FlashcardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Flashcards Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
