// app/subjects/[id].jsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SubjectHeader from '../../components/layout/SubjectHeader';
import CollectionCard from '../../components/ui/CollectionCard';

import {
  addCollection,
  deleteCollection,
  fetchCollections,
} from '../../firebase/collectionService';
import { getSubjectById, updateSubject } from '../../firebase/subjectService';

export default function SubjectCollectionsScreen() {
  const { id } = useLocalSearchParams(); // subjectId nga route
  const subjectId = String(id);

  const [subject, setSubject] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [error, setError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  // Load subject + collections
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const subj = await getSubjectById(subjectId);
        setSubject(subj);
        setEditedName(subj.name);

        const cols = await fetchCollections(subjectId);
        setCollections(cols);
      } catch (err) {
        console.log('Error loading subject/collections:', err);
        setError(err.message ?? 'Nuk u ngarkua lënda.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [subjectId]);

  const handleUpdateSubjectName = async () => {
    if (!editedName.trim()) return;

    try {
      setSavingName(true);
      await updateSubject(subjectId, { name: editedName.trim() });
      setSubject((prev) => (prev ? { ...prev, name: editedName.trim() } : prev));
      setIsEditingName(false);
    } catch (err) {
      console.log('Error updating subject name:', err);
      setError(err.message ?? 'Nuk u përditësua emri i lëndës.');
    } finally {
      setSavingName(false);
    }
  };

  const handleAddCollection = async () => {
    if (!newCollectionName.trim()) return;

    try {
      const created = await addCollection(subjectId, newCollectionName.trim());
      setCollections((prev) => [...prev, created]);
      setNewCollectionName('');
      setModalVisible(false);
    } catch (err) {
      console.log('Error adding collection:', err);
      setError(err.message ?? 'Nuk u shtua koleksioni.');
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      await deleteCollection(subjectId, collectionId);
      setCollections((prev) => prev.filter((c) => c.id !== collectionId));
    } catch (err) {
      console.log('Error deleting collection:', err);
      setError(err.message ?? 'Nuk u fshi koleksioni.');
    }
  };

  const handleCollectionPress = (collection) => {
    router.push({
      pathname: '/subjects/[subjectId]/collections/[collectionId]',
      params: {
        subjectId,
        collectionId: String(collection.id),
      },
    });
  };

  if (loading && !subject) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!subject) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Subject not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header me emrin dhe statistikat e subject-it */}
      <SubjectHeader subject={subject} collectionCount={collections.length} />

      <View style={styles.content}>
        {!!error && <Text style={styles.errorMessage}>{error}</Text>}

        {/* Buton i vogël për Rename subject */}
        <View style={styles.renameQuick}>
          <Pressable
            style={styles.editNameButton}
            onPress={() => {
              setEditedName(subject.name);
              setIsEditingName(true);
            }}
          >
            <Ionicons name="create-outline" size={20} color="#4F46E5" />
            <Text style={styles.editNameText}>Rename subject</Text>
          </Pressable>
        </View>

        {/* Header për Collections + Add button */}
        <View style={styles.collectionsHeader}>
          <Text style={styles.collectionsTitle}>Collections</Text>
          <Pressable style={styles.addCollectionButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={24} color="#4F46E5" />
            <Text style={styles.addCollectionText}>Add Collection</Text>
          </Pressable>
        </View>

        {/* Lista e koleksioneve */}
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <CollectionCard collection={item} onPress={() => handleCollectionPress(item)} />
              <Pressable
                style={styles.deleteCollection}
                onPress={() => handleDeleteCollection(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nuk ka ende collections për këtë lëndë.</Text>
          }
        />
      </View>

      {/* Modal për rename të subject-it */}
      <Modal visible={isEditingName} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Subject</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="New subject name"
              value={editedName}
              onChangeText={setEditedName}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditingName(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.createButton]}
                onPress={handleUpdateSubjectName}
                disabled={savingName}
              >
                {savingName ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal për krijimin e collection-it të ri */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Collection</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Collection name"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewCollectionName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.createButton]}
                onPress={handleAddCollection}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorMessage: {
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  renameQuick: {
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 8,
  },
  editNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E0E7FF',
  },
  editNameText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  collectionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  addCollectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addCollectionText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  },
  deleteCollection: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
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
});
