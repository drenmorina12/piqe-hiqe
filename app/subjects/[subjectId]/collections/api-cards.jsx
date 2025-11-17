import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { addCard } from '../../../../firebase/cardService';


export default function ApiCardsScreen() {
  const { subjectId, collectionId } = useLocalSearchParams();
  const router = useRouter();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1️⃣ Marrim "posts" nga JSONPlaceholder
  useEffect(() => {
    const fetchApiCards = async () => {
      try {
        setLoading(true);
        setError('');
        // Marrim 10 quotes në anglisht nga DummyJSON
        const res = await fetch('https://dummyjson.com/quotes?limit=10');
        const data = await res.json();

        // data.quotes është një array [{ id, quote, author }, ...]
        const mapped = data.quotes.map((item) => ({
        id: String(item.id),
        question: item.quote,              // pyetja = quote
        answer: `Author: ${item.author}`,  // përgjigjja = autori
        source: 'DummyJSON Quotes',
        }));


        setCards(mapped);
      } catch (e) {
        console.log('API ERROR:', e);
        setError('Failed to load cards from API.');
      } finally {
        setLoading(false);
      }
    };

    fetchApiCards();
  }, []);

  // 2️⃣ Kur user shtyp "Add to my flashcards"
 const handleAddCard = async (card) => {
  try {
    await addCard(String(subjectId), String(collectionId), {
      question: card.question,
      answer: card.answer,
      source: card.source,   // fusha ekstra, Firestore s’ankohet
    });

    alert('Card added to your collection!');
  } catch (e) {
    console.log('ADD CARD ERROR:', e);
    alert(`Failed to add card: ${e?.message ?? String(e)}`);
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading cards ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#075eec' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested cards </Text>
      <Text style={styles.subtitle}>
        These cards are fetched from JSONPlaceholder (public API). You can add them to your
        flashcard collection.
      </Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>

            <TouchableOpacity onPress={() => handleAddCard(item)}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Add to my flashcards</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  answer: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  btn: {
    backgroundColor: '#075eec',
    paddingVertical: 8,
    borderRadius: 9999,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
