import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';
import CollectionCard from '../../components/ui/CollectionCard';
import Toast from '../../components/ui/Toast';
import { fetchCards } from '../../firebase/cardService';
import {
  addCollection,
  deleteCollection,
  fetchCollections,
} from '../../firebase/collectionService';

import AnimatedModal from '../../components/ui/AnimatedModal';
import { getSubjectById } from '../../firebase/subjectService';

export default function SubjectCollectionsScreen() {
  const { id } = useLocalSearchParams();
  const subjectId = String(id);

  const [subject, setSubject] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('error');

  // Load subject + collections
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const subj = await getSubjectById(subjectId);
        setSubject(subj);

        const cols = await fetchCollections(subjectId);
        // Enrich with card counts if missing
        const colsWithCounts = await Promise.all(
          cols.map(async (c) => {
            if (typeof c?.cards === 'number') return c;
            try {
              const cards = await fetchCards(subjectId, c.id);
              return {
                ...c,
                cards: cards.length,
                completed: cards.filter((x) => !!x.completed).length,
              };
            } catch {
              return { ...c, cards: 0, completed: 0 };
            }
          })
        );
        setCollections(colsWithCounts);
      } catch (err) {
        console.log('Error loading subject/collections:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [subjectId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.errorContainer}>
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

  const handleAddCollection = async () => {
    if (newCollectionName.trim() === '') return;

    try {
      const created = await addCollection(subjectId, newCollectionName.trim());
      setCollections((prev) => [...prev, created]);
      setNewCollectionName('');
      setModalVisible(false);
      setSuccess('Collection created successfully');
    } catch (err) {
      console.log('Error adding collection:', err);
      setError(err.message ?? 'Failed to create collection. Please try again.');
      setErrorType('error');
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      await deleteCollection(subjectId, collectionId);
      setCollections((prev) => prev.filter((c) => c.id !== collectionId));
      setSuccess('Collection deleted successfully');
    } catch (err) {
      console.log('Error deleting collection:', err);
      setError(err.message ?? 'Failed to delete collection. Please try again.');
      setErrorType('error');
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        backgroundColor={subject.headerColor}
        title={subject.name}
        subtitle={`${collections.length} ${collections.length === 1 ? 'collection' : 'collections'}`}
        icon={subject.icon}
        showHome
        showBack={true}
      />

      {/* Collections List */}
      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Koleksionet</Text>
        </View>

        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <CollectionCard
                collection={item}
                onPress={() => handleCollectionPress(item)}
                gradientColors={['#4F46E5', '#6366F1']}
                onDelete={handleDeleteCollection} // ⬅️ LIDHET ME FUNKSIONIN TËND
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
              Nuk ka koleksione. Krijo koleksionin tënd të parë!
            </Text>
          }
        />

        {/* Add Collection Button */}
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#4F46E5" />
          <Text style={styles.addButtonText}>Shto koleksion</Text>
        </Pressable>
      </View>

      {/* Add Collection Modal */}
      <AnimatedModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setNewCollectionName('');
        }}
      >
        <View>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Koleksioni i ri</Text>
            <Pressable
              onPress={() => {
                setModalVisible(false);
                setNewCollectionName('');
              }}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Collection name"
            value={newCollectionName}
            onChangeText={setNewCollectionName}
            autoFocus
          />

          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setNewCollectionName('');
              }}
            >
              <Text style={styles.cancelButtonText}>Anulo</Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.createButton]}
              onPress={handleAddCollection}
            >
              <Text style={styles.createButtonText}>Krijo</Text>
            </Pressable>
          </View>
        </View>
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
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#4F46E5',
    marginBottom: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
