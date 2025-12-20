import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../../../components/layout/Header';
import { deleteCard, getCardById, updateCard } from '../../../../../firebase/cardService';
import { getSubjectById as fetchSubjectById } from '../../../../../firebase/subjectService';

export default function FlashcardEditScreen() {
  const { subjectId, collectionId, cardId } = useLocalSearchParams();
  const [subject, setSubject] = useState(null);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const subj = await fetchSubjectById(String(subjectId));
        setSubject(subj);

        const flashcard = await getCardById(
          String(subjectId),
          String(collectionId),
          String(cardId)
        );
        setCard(flashcard);
        setQuestion(flashcard.question || '');
        setAnswer(flashcard.answer || '');
      } catch (err) {
        console.log('Error loading flashcard:', err);
        setError('Failed to load flashcard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [subjectId, collectionId, cardId]);

  const handleSave = async () => {
    setError('');
    if (saving) return;

    if (question.trim() === '' || answer.trim() === '') {
      setError('Both question and answer are required.');
      return;
    }

    setSaving(true);
    try {
      await updateCard(String(subjectId), String(collectionId), String(cardId), {
        question: question.trim(),
        answer: answer.trim(),
      });

      router.back();
    } catch (err) {
      console.log('Error updating card:', err);
      setError(err.message ?? 'Failed to update card.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Flashcard',
      'Are you sure you want to delete this flashcard? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteCard(String(subjectId), String(collectionId), String(cardId));
              router.back();
            } catch (err) {
              console.log('Error deleting card:', err);
              Alert.alert('Error', 'Failed to delete flashcard');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (!card || !subject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Flashcard not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header
        backgroundColor={subject.headerColor}
        title={subject.name}
        subtitle="Edit Flashcard"
        icon={subject.icon}
        showBack={true}
        showHome
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.label}>Question</Text>
          <TextInput
            style={[styles.input, styles.questionInput]}
            placeholder="Enter your question..."
            value={question}
            onChangeText={setQuestion}
            multiline
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Answer</Text>
          <TextInput
            style={[styles.input, styles.answerInput]}
            placeholder="Enter the answer..."
            value={answer}
            onChangeText={setAnswer}
            multiline
          />
        </View>

        {card.difficulty && (
          <View style={styles.section}>
            <Text style={styles.label}>Current Difficulty</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{card.difficulty}</Text>
            </View>
          </View>
        )}

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.saveButton, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving || deleting}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={[styles.button, styles.deleteButton, deleting && { opacity: 0.7 }]}
            onPress={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="trash" size={20} color="white" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#111827',
  },
  questionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  answerInput: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  errorMessage: {
    color: '#EF4444',
    marginBottom: 16,
    fontSize: 14,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
