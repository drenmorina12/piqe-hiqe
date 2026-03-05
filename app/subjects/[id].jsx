import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import { getSubjectById } from '../../firebase/subjectService';

export default function SubjectCollectionsScreen() {
  const { colors } = useTheme();
  const accent = colors.primary ?? colors.tint ?? '#4F46E5';

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

  // Define all callbacks BEFORE any conditional returns (Rules of Hooks)
  const handleAddCollection = useCallback(async () => {
    if (newCollectionName.trim() === '') return;

    try {
      const created = await addCollection(subjectId, newCollectionName.trim());
      setCollections((prev) => [...prev, created]);
      setNewCollectionName('');
      setModalVisible(false);
      setSuccess('Koleksioni u krijua me sukses');
    } catch (err) {
      console.log('Gabim gjatë shtimit të koleksionit:', err);
      setError(err.message ?? 'Krijimi i koleksionit dështoi. Ju lutemi provoni përsëri.');
      setErrorType('error');
    }
  }, [newCollectionName, subjectId]);

  const handleDeleteCollection = useCallback(
    async (collectionId) => {
      try {
        await deleteCollection(subjectId, collectionId);
        setCollections((prev) => prev.filter((c) => c.id !== collectionId));
        setSuccess('Koleksioni u fshi me sukses');
      } catch (err) {
        console.log('Gabim gjatë fshirjes së koleksionit:', err);
        setError(err.message ?? 'Fshirja e koleksionit dështoi. Ju lutemi provoni përsëri.');
        setErrorType('error');
      }
    },
    [subjectId]
  );

  const handleCollectionPress = useCallback(
    (collection) => {
      router.push({
        pathname: '/subjects/[subjectId]/collections/[collectionId]',
        params: {
          subjectId,
          collectionId: String(collection.id),
        },
      });
    },
    [subjectId]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderCollectionItem = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 12 }}>
        <CollectionCard
          collection={item}
          onPress={() => handleCollectionPress(item)}
          gradientColors={['#4F46E5', '#6366F1']}
          onDelete={handleDeleteCollection}
        />
      </View>
    ),
    [handleCollectionPress, handleDeleteCollection]
  );

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
        console.log('Gabim gjatë ngarkimit të subjektin/koleksionin:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [subjectId]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={accent} />
      </SafeAreaView>
    );
  }

  if (!subject) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.mutedText ?? '#6B7280' }]}>
          Lënda nuk u gjet
        </Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: accent }]}>Kthehu prapa</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Header
        backgroundColor={subject.headerColor}
        title={subject.name}
        subtitle={`${collections.length} ${collections.length === 1 ? 'koleksion' : 'koleksione'}`}
        icon={subject.icon}
        showHome
        showBack={true}
      />

      {/* Collections List */}
      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>Koleksionet</Text>
        </View>

        <FlatList
          data={collections}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={renderCollectionItem}
          ListEmptyComponent={
            <Text style={{ color: colors.mutedText ?? '#6B7280', marginTop: 16, textAlign: 'center' }}>
              Nuk ka koleksione. Krijo koleksionin tënd të parë!
            </Text>
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={10}
        />

        {/* Add Collection Button */}
        <Pressable
          style={[
            styles.addButton,
            {
              backgroundColor: colors.card ?? colors.background,
              borderColor: accent,
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={accent} />
          <Text style={[styles.addButtonText, { color: accent }]}>Shto koleksion</Text>
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>Koleksioni i ri</Text>
            <Pressable
              onPress={() => {
                setModalVisible(false);
                setNewCollectionName('');
              }}
            >
              <Ionicons name="close" size={24} color={colors.mutedText ?? '#6B7280'} />
            </Pressable>
          </View>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border ?? '#D1D5DB',
                backgroundColor: colors.inputBg ?? colors.card ?? colors.background,
                color: colors.text,
              },
            ]}
            placeholder="Emri i koleksionit"
            placeholderTextColor={colors.placeholder ?? colors.mutedText ?? '#9CA3AF'}
            value={newCollectionName}
            onChangeText={setNewCollectionName}
            autoFocus
          />

          <View style={styles.modalButtons}>
            <Pressable
              style={[
                styles.modalButton,
                styles.cancelButton,
                { backgroundColor: colors.card ?? '#F3F4F6' },
              ]}
              onPress={() => {
                setModalVisible(false);
                setNewCollectionName('');
              }}
            >
              <Text style={[styles.cancelButtonText, { color: colors.mutedText ?? '#6B7280' }]}>
                Anulo
              </Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.createButton, { backgroundColor: accent }]}
              onPress={handleAddCollection}
            >
              <Text style={[styles.createButtonText, { color: colors.onPrimary ?? 'white' }]}>
                Krijo
              </Text>
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

  // nëse i ke tashmë këto styles diku tjetër, lëri si janë (s’preket logjika)
  backButton: { paddingVertical: 10, paddingHorizontal: 14 },
  backButtonText: { fontSize: 16, fontWeight: '600' },
});
