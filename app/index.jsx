import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
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

import Header from '../components/layout/Header';
import { StatsCard } from '../components/ui/StatsCard';
import SubjectCard from '../components/ui/SubjectCard';

import { auth } from '../firebase';
import { fetchCollections } from '../firebase/collectionService';
import {
  addSubject as createSubject,
  deleteSubject as deleteSubjectFromDb,
  fetchSubjects,
} from '../firebase/subjectService';

export default function HomeScreen() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  
  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchSubjects();

      
      const subjectsWithCounts = await Promise.all(
        data.map(async (s) => {
          try {
            const cols = await fetchCollections(s.id);
            return { ...s, collectionCount: cols.length };
          } catch (err) {
            console.log('Error fetching collections for subject', s.id, err);
            return { ...s, collectionCount: 0 };
          }
        })
      );

      setSubjects(subjectsWithCounts);
    } catch (err) {
      console.log('Error fetching subjects:', err);
      setError(err.message ?? 'Nuk u ngarkuan lëndët. Provo përsëri.');
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    if (authReady) {
      loadSubjects();
    }
  }, [authReady, loadSubjects]);

  
  useFocusEffect(
    useCallback(() => {
      if (!authReady) return;
      loadSubjects();
    }, [authReady, loadSubjects])
  );

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      setLoading(true);
      setError('');
      const created = await createSubject(newSubject);

     
      const createdWithCount = { ...created, collectionCount: 0 };

      setSubjects((prev) => [...prev, createdWithCount]);
      setNewSubject('');
      setShowInput(false);
      setSuccess('Subject u shtua me sukses.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.log('Error adding subject:', err);
      setError(err.message ?? 'Nuk u shtua subject-i. Provo përsëri.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubject = async (subjectId) => {
    try {
      setLoading(true);
      setError('');
      await deleteSubjectFromDb(subjectId);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      setSuccess('Subject u fshi.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.log('Error deleting subject:', err);
      setError(err.message ?? 'Nuk u fshi subject-i.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectPress = (subject) => {
    router.push({
      pathname: '/subjects/[id]',
      params: { id: subject.id },
    });
  };

  if (!authReady) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <StatusBar style="light" backgroundColor="#007AFF" />
      <Header
        title="Piqe-Hiqe"
        subtitle="Your daily lessons"
        rightButton={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <Link href="/profile" asChild>
              <Pressable>
                <Ionicons name="person-circle-outline" size={28} color="white" />
              </Pressable>
            </Link>

            <Pressable onPress={() => setShowInput(!showInput)}>
              <Ionicons name="add" size={28} color="white" />
            </Pressable>
          </View>
        }
      />

      <View style={styles.container}>
        <View style={styles.generalStatsContainer}>
          <StatsCard subject="12" easy={0} medium={0} hard={0} label="Day Streak" />
          <StatsCard subject="245" easy={0} medium={0} hard={0} label="Cards Done" />
          <StatsCard
            subject={subjects.length.toString()}
            easy={0}
            medium={0}
            hard={0}
            label="Subjects"
          />
        </View>

        <Text style={styles.title}>Your Subjects</Text>

        {loading && (
          <View style={{ marginBottom: 10 }}>
            <ActivityIndicator />
          </View>
        )}

        {!!error && (
          <Text style={{ color: '#EF4444', marginBottom: 8, textAlign: 'center' }}>{error}</Text>
        )}

        {!!success && (
          <Text style={{ color: '#16A34A', marginBottom: 8, textAlign: 'center' }}>
            {success}
          </Text>
        )}

        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter subject name"
              value={newSubject}
              onChangeText={setNewSubject}
            />
            <Pressable style={styles.addButton} onPress={handleAddSubject}>
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        )}

        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
          contentContainerStyle={{ paddingVertical: 10, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15, width: '48%' }}>
              <Pressable onPress={() => handleSubjectPress(item)}>
                <SubjectCard
                  subjectName={item.name}
                  icon={require('../assets/images/flashcard.png')}
                  iconBackgroundColor={item.iconBackgroundColor || '#E0F2FE'}
                  collectionCount={item.collectionCount ?? 0}
                />
              </Pressable>
              <Pressable
                onPress={() => handleRemoveSubject(item.id)}
                style={{ marginTop: 4, alignSelf: 'flex-end' }}
              >
                <Ionicons name="trash" size={22} color="#EF4444" />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            !loading && (
              <Text style={{ color: '#777', marginTop: 20 }}>No subjects added yet.</Text>
            )
          }
        />
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Pressable style={styles.bottomButton} disabled>
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.bottomButtonText}>Home</Text>
        </Pressable>

        <Pressable style={styles.bottomButton} onPress={() => router.push('/progress')}>
          <Ionicons name="stats-chart" size={24} color="#007AFF" />
          <Text style={styles.bottomButtonText}>Progress</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  generalStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: '100%',
    marginBottom: 20,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  bottomButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
