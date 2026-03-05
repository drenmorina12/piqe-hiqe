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
import Toast from '../../../../../components/ui/Toast';
import { useTheme } from '../../../../../context/ThemeContext';
import { deleteCard, getCardById, updateCard } from '../../../../../firebase/cardService';
import { getSubjectById as fetchSubjectById } from '../../../../../firebase/subjectService';

export default function FlashcardEditScreen() {
  const { colors } = useTheme();
  const accent = colors.primary ?? colors.tint ?? '#4F46E5';

  const { subjectId, collectionId, cardId } = useLocalSearchParams();
  const [subject, setSubject] = useState(null);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('error');
  const [success, setSuccess] = useState('');

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
        setError('Ngarkimi i kartelës dështoi');
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
      setError('Kërkohen pyetje edhe përgjigje.');
      return;
    }

    setSaving(true);
    try {
      await updateCard(String(subjectId), String(collectionId), String(cardId), {
        question: question.trim(),
        answer: answer.trim(),
      });

      setSuccess('Karta u përditësua me sukses');
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err) {
      console.log('Gabim gjatë përditësimit të kartës:', err);
      setError(err.message ?? 'Përditësimi i kartës dështoi. Ju lutemi provoni përsëri.');
      setErrorType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Jeni i sigurt që dëshironi të fshini këtë kartë? Ky veprim nuk mund të zhbëhet.'
      );

      if (!confirmed) return;

      try {
        setDeleting(true);
        await deleteCard(String(subjectId), String(collectionId), String(cardId));

        router.replace({
          pathname: '/subjects/[subjectId]/collections/[collectionId]',
          params: {
            subjectId: String(subjectId),
            collectionId: String(collectionId),
            deletedFlashcard: 'true',
          },
        });
      } catch (err) {
        console.log('Gabim gjatë fshirjes së kartës:', err);
        setError('Fshirja e kartës dështoi. Ju lutemi provoni përsëri.');
        setErrorType('error');
      } finally {
        setDeleting(false);
      }

      return;
    }

    Alert.alert(
      'Fshi Kartën',
      'Jeni i sigurt që dëshironi të fshini këtë kartë? Ky veprim nuk mund të zhbëhet.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Fshije',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteCard(String(subjectId), String(collectionId), String(cardId));

              router.replace({
                pathname: '/subjects/[subjectId]/collections/[collectionId]',
                params: {
                  subjectId: String(subjectId),
                  collectionId: String(collectionId),
                  deletedFlashcard: 'true',
                },
              });
            } catch (err) {
              console.log('Error deleting card:', err);
              Alert.alert('Error', 'Fshirja e kartës dështoi. Ju lutemi provoni përsëri.');
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" style={{ marginTop: 100 }} color={accent} />
      </SafeAreaView>
    );
  }

  if (!card || !subject) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.mutedText ?? '#6B7280' }]}>Karta nuk u gjet</Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: accent }]}
        >
          <Text style={[styles.backButtonText, { color: colors.onPrimary ?? 'white' }]}>Kthehu</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header
        backgroundColor={subject.headerColor}
        title={subject.name}
        subtitle="Përditëso kartën"
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
          <Text style={[styles.label, { color: colors.text }]}>Pyetja</Text>
          <TextInput
            style={[
              styles.input,
              styles.questionInput,
              {
                borderColor: colors.border ?? '#D1D5DB',
                backgroundColor: colors.inputBg ?? colors.card ?? 'white',
                color: colors.text,
              },
            ]}
            placeholder="Shkruani pyetjen tuaj..."
            placeholderTextColor={colors.placeholder ?? colors.mutedText ?? '#9CA3AF'}
            value={question}
            onChangeText={setQuestion}
            multiline
            autoFocus
            selectionColor={accent}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Përgjigjia</Text>
          <TextInput
            style={[
              styles.input,
              styles.answerInput,
              {
                borderColor: colors.border ?? '#D1D5DB',
                backgroundColor: colors.inputBg ?? colors.card ?? 'white',
                color: colors.text,
              },
            ]}
            placeholder="Shkruani përgjigjen..."
            placeholderTextColor={colors.placeholder ?? colors.mutedText ?? '#9CA3AF'}
            value={answer}
            onChangeText={setAnswer}
            multiline
            selectionColor={accent}
          />
        </View>

        {card.difficulty && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Vështirësia aktuale</Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: colors.chipBg ?? colors.surface ?? '#F3F4F6' },
              ]}
            >
              <Text style={[styles.difficultyText, { color: colors.mutedText ?? '#6B7280' }]}>
                {card.difficulty}
              </Text>
            </View>
          </View>
        )}

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              styles.saveButton,
              { backgroundColor: accent },
              saving && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={saving || deleting}
          >
            {saving ? (
              <ActivityIndicator color={colors.onPrimary ?? '#fff'} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={'white'} />
                <Text style={[styles.saveButtonText, { color: 'white' }]}>
                  Ruaj Ndryshimet
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.deleteButton,
              deleting && { opacity: 0.7 },
            ]}
            onPress={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="trash" size={20} color="white" />
                <Text style={styles.deleteButtonText}>Fshije</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <Toast message={success} type="success" visible={!!success} onHide={() => setSuccess('')} />
      <Toast message={error} type={errorType} visible={!!error} onHide={() => setError('')} />
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
