import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
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
import SubjectHeader from '../../../../components/layout/SubjectHeader';
import { getCollectionById, getSubjectById } from '../../../../constants/mockData';

export default function CollectionDetailScreen() {
  const { subjectId, collectionId } = useLocalSearchParams();
  const subject = getSubjectById(subjectId);
  const collection = getCollectionById(subjectId, collectionId);

  // State for flashcards
  const [flashcards, setFlashcards] = useState(collection?.flashcards || []);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

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

  const handleAddFlashcard = () => {
    if (newQuestion.trim() !== '' && newAnswer.trim() !== '') {
      const newFlashcard = {
        id: Date.now().toString(),
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
        difficulty: null,
      };
      setFlashcards([...flashcards, newFlashcard]);
      setNewQuestion('');
      setNewAnswer('');
      setShowForm(false);
    }
  };

  const handleDeleteFlashcard = (flashcardId) => {
    setFlashcards(flashcards.filter((card) => card.id !== flashcardId));
  };

  const handleStartStudy = () => {
    if (flashcards.length > 0) {
      router.push({
        pathname: `/subjects/[subjectId]/collections/[collectionId]/study`,
        params: {
          subjectId: String(subjectId),
          collectionId: String(collectionId),
        },
      });
    }
  };

  const renderFlashcardItem = ({ item }) => (
    <View style={styles.flashcardItem}>
      <View style={styles.flashcardContent}>
        <View style={styles.flashcardHeader}>
          <Ionicons name="help-circle-outline" size={20} color="#4F46E5" />
          <Text style={styles.flashcardQuestion} numberOfLines={2}>
            {item.question}
          </Text>
        </View>
        <View style={styles.flashcardBody}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
          <Text style={styles.flashcardAnswer} numberOfLines={2}>
            {item.answer}
          </Text>
        </View>
        {item.difficulty && (
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        )}
      </View>
      <Pressable onPress={() => handleDeleteFlashcard(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <SubjectHeader subject={subject} collectionCount={flashcards.length} />

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
              keyExtractor={(item) => item.id}
              renderItem={renderFlashcardItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
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

      {/* Add Flashcard Form - Outside main content, as overlay */}
      {showForm && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>New Flashcard</Text>
              <Pressable
                onPress={() => {
                  setShowForm(false);
                  setNewQuestion('');
                  setNewAnswer('');
                }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Question</Text>
              <TextInput
                style={[styles.input, styles.questionInput]}
                placeholder="Enter your question..."
                value={newQuestion}
                onChangeText={setNewQuestion}
                multiline
                autoFocus
              />

              <Text style={styles.inputLabel}>Answer</Text>
              <TextInput
                style={[styles.input, styles.answerInput]}
                placeholder="Enter the answer..."
                value={newAnswer}
                onChangeText={setNewAnswer}
                multiline
              />

              <View style={styles.formButtons}>
                <Pressable
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setShowForm(false);
                    setNewQuestion('');
                    setNewAnswer('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.formButton, styles.createButton]}
                  onPress={handleAddFlashcard}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      )}
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
    paddingBottom: 180,
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
});
