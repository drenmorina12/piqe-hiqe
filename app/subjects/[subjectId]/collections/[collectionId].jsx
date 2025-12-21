import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import CollectionProgressPie from '../../../../components/charts/CollectionProgressPie';
import Header from '../../../../components/layout/Header';
import AnimatedModal from '../../../../components/ui/AnimatedModal';
import Toast from '../../../../components/ui/Toast';
import {
  addCard,
  deleteCard,
  fetchCards,
  resetCardsDifficulty,
} from '../../../../firebase/cardService';
import {
  getCollectionById as fetchCollectionById,
  resetCollectionProgress,
} from '../../../../firebase/collectionService';
import { getSubjectById as fetchSubjectById } from '../../../../firebase/subjectService';

export default function CollectionDetailScreen() {
  const params = useLocalSearchParams();
  const { subjectId, collectionId, deletedFlashcard } = params;
  const [subject, setSubject] = useState(null);
  const [collection, setCollection] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [formError, setFormError] = useState('');
  const [savingCard, setSavingCard] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('error');

  const [loading, setLoading] = useState(true);

  // Load subject, collection and cards from Firestore
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const subj = await fetchSubjectById(String(subjectId));
      setSubject(subj);

      const coll = await fetchCollectionById(String(subjectId), String(collectionId));
      const cards = await fetchCards(String(subjectId), String(collectionId));
      // Ensure collection metadata is present; fallback to counts derived from cards
      const collWithCounts = {
        ...coll,
        cards: typeof coll?.cards === 'number' ? coll.cards : cards.length,
        completed:
          typeof coll?.completed === 'number'
            ? coll.completed
            : cards.filter((c) => !!c.completed).length,
        progress: coll.progress ?? { easy: 0, medium: 0, hard: 0 },
      };

      setCollection(collWithCounts);
      setFlashcards(cards);
    } catch (err) {
      console.log('Error loading collection or cards:', err);
    } finally {
      setLoading(false);
    }
  }, [subjectId, collectionId]);

  // Reload data when screen comes into focus (after returning from study/edit/import)
  useFocusEffect(
    useCallback(() => {
      loadData();

      // Check if we returned from deleting a flashcard
      if (deletedFlashcard === 'true') {
        setSuccess('Flashcard deleted successfully');
        // Clear the param by replacing the route without it
        router.replace({
          pathname: '/subjects/[subjectId]/collections/[collectionId]',
          params: {
            subjectId: String(subjectId),
            collectionId: String(collectionId),
          },
        });
      }
    }, [loadData, deletedFlashcard])
  );
  const derivedProgress = useMemo(
    () => ({
      easy: flashcards.filter((c) => c.difficulty === 'easy').length,
      medium: flashcards.filter((c) => c.difficulty === 'medium').length,
      hard: flashcards.filter((c) => c.difficulty === 'hard').length,
    }),
    [flashcards]
  );

  const totalProgress = useMemo(
    () => derivedProgress.easy + derivedProgress.medium + derivedProgress.hard,
    [derivedProgress]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!subject || !collection) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Collection not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleAddFlashcard = useCallback(async () => {
    setFormError('');
    if (savingCard) return; // prevent duplicate presses

    if (newQuestion.trim() === '' || newAnswer.trim() === '') {
      setFormError('Both question and answer are required.');
      return;
    }

    setSavingCard(true);
    try {
      const created = await addCard(String(subjectId), String(collectionId), {
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      });

      setFlashcards((prev) => [...prev, created]);

      // update local collection counts to reflect new card
      setCollection((prev) => ({
        ...prev,
        cards: (prev?.cards ?? 0) + 1,
      }));

      setNewQuestion('');
      setNewAnswer('');
      setShowForm(false);
      setSuccess('Flashcard created successfully');
    } catch (err) {
      console.log('Error adding card:', err);
      setFormError(err.message ?? 'Failed to create flashcard.');
      setError(err.message ?? 'Failed to create flashcard. Please try again.');
      setErrorType('error');
    } finally {
      setSavingCard(false);
    }
  }, [savingCard, newQuestion, newAnswer, subjectId, collectionId]);

  const handleDeleteFlashcard = useCallback(
    async (flashcardId) => {
      try {
        await deleteCard(String(subjectId), String(collectionId), flashcardId);
        setFlashcards((prev) => prev.filter((card) => card.id !== flashcardId));

        // decrement local collection cards count
        setCollection((prev) => ({
          ...prev,
          cards: Math.max((prev?.cards ?? 1) - 1, 0),
        }));
        setSuccess('Flashcard deleted successfully');
      } catch (err) {
        console.log('Error deleting card:', err);
        setError(err.message ?? 'Failed to delete flashcard. Please try again.');
        setErrorType('error');
      }
    },
    [subjectId, collectionId]
  );

  const handleStartStudy = useCallback(() => {
    if (flashcards.length > 0) {
      router.push({
        pathname: `/subjects/[subjectId]/collections/[collectionId]/study`,
        params: {
          subjectId: String(subjectId),
          collectionId: String(collectionId),
        },
      });
    }
  }, [flashcards.length, subjectId, collectionId]);

  const handleResetProgress = useCallback(async () => {
    try {
      // 1️⃣ reset collection progress
      await resetCollectionProgress(String(subjectId), String(collectionId));

      // 2️⃣ reset cards në DB
      await resetCardsDifficulty(String(subjectId), String(collectionId));

      // 3️⃣ refresh EVERYTHING from source of truth
      await loadData();
    } catch (err) {
      console.log('Error resetting progress:', err);
    }
  }, [subjectId, collectionId, loadData]);

  const handleFlashcardPress = useCallback(
    (cardId) => {
      router.push({
        pathname: `/subjects/[subjectId]/collections/[collectionId]/[cardId]`,
        params: {
          subjectId: String(subjectId),
          collectionId: String(collectionId),
          cardId: String(cardId),
        },
      });
    },
    [subjectId, collectionId]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderFlashcardItem = useCallback(
    ({ item }) => (
      <Pressable
        style={({ pressed }) => [styles.flashcardItem, pressed && styles.flashcardItemPressed]}
        onPress={() => handleFlashcardPress(item.id)}
      >
        <View style={styles.flashcardContent}>
          <View style={styles.flashcardHeader}>
            <Ionicons name="help-circle-outline" size={20} color="#4F46E5" />
            <Text style={styles.flashcardQuestion} numberOfLines={2}>
              {item.question}
            </Text>
          </View>
          {item.difficulty && (
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>
    ),
    [handleFlashcardPress]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        backgroundColor={subject.headerColor}
        title={subject.name}
        subtitle={`${flashcards.length} ${flashcards.length === 1 ? 'flashcard' : 'flashcards'}`}
        icon={subject.icon}
        showBack={true}
        showHome
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.collectionInfo}>
          <Text style={styles.collectionName}>{collection.name}</Text>
          <Text style={styles.cardCount}>
            {flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'}
          </Text>
        </View>

        {/* Flashcards List */}
        {flashcards.length > 0 ? (
          <>
            <FlatList
              data={flashcards}
              keyExtractor={keyExtractor}
              renderItem={renderFlashcardItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              windowSize={10}
              ListHeaderComponent={
                totalProgress > 0 ? (
                  <>
                    <CollectionProgressPie progress={derivedProgress} />

                    <Pressable
                      onPress={handleResetProgress}
                      style={{
                        alignSelf: 'center',
                        marginBottom: 16,
                        paddingVertical: 6,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        backgroundColor: '#F3F4F6',
                      }}
                    >
                      <Text style={{ color: '#6B7280', fontWeight: '600' }}>Reset progress</Text>
                    </Pressable>
                  </>
                ) : null
              }
            />

            {/* Start Study Button */}
            {!showForm && (
              <Pressable style={styles.studyButton} onPress={handleStartStudy}>
                <Ionicons name="school" size={20} color="white" />
                <Text style={styles.studyButtonText}>Start Study Session</Text>
              </Pressable>
            )}
          </>
        ) : (
          !showForm && (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No flashcards yet</Text>
              <Text style={styles.emptySubtext}>Create your first flashcard to get started</Text>
            </View>
          )
        )}

        {/* Add Flashcard Button */}
        {!showForm && (
          <Pressable style={styles.addButton} onPress={() => setShowForm(true)}>
            <Ionicons name="add" size={20} color="#4F46E5" />
            <Text style={styles.addButtonText}>Add Flashcard</Text>
          </Pressable>
        )}
      </View>
      <AnimatedModal
        visible={showForm}
        variant="bottom"
        onClose={() => {
          setShowForm(false);
          setNewQuestion('');
          setNewAnswer('');
          setFormError('');
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%' }}
        >
          <View
            style={[styles.formContainer, { maxWidth: 650, width: '95%', alignSelf: 'center' }]}
          >
            {/* Header */}
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>New Flashcard</Text>
              <Pressable onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            {/* Scrollable content */}
            <ScrollView
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>Question</Text>
              <TextInput
                style={[styles.input, styles.questionInput]}
                placeholder="Enter your question..."
                value={newQuestion}
                onChangeText={setNewQuestion}
                multiline
              />

              <Text style={styles.inputLabel}>Answer</Text>
              <TextInput
                style={[styles.input, styles.answerInput]}
                placeholder="Enter the answer..."
                value={newAnswer}
                onChangeText={setNewAnswer}
                multiline
              />

              {formError ? (
                <Text style={{ color: '#EF4444', marginBottom: 8 }}>{formError}</Text>
              ) : null}
            </ScrollView>

            {/* FIXED BUTTONS */}
            <View style={styles.formButtons}>
              <Pressable
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.formButton, styles.createButton, savingCard && { opacity: 0.7 }]}
                onPress={handleAddFlashcard}
                disabled={savingCard}
              >
                {savingCard ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Create</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </AnimatedModal>

      <Toast message={success} type="success" visible={!!success} onHide={() => setSuccess('')} />

      <Toast message={error} type={errorType} visible={!!error} onHide={() => setError('')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  collectionInfo: {
    marginBottom: 20,
  },
  collectionName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 320,
  },

  flashcardItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flashcardItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  flashcardContent: {
    flex: 1,
  },
  flashcardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  flashcardQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  flashcardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  flashcardAnswer: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  studyButton: {
    position: 'absolute',
    bottom: 90,
    left: 24,
    right: 24,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  studyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardAvoidingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  questionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  answerInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#4F46E5',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  apiButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    marginBottom: 12,
  },
  apiButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
});
