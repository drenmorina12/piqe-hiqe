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

import { fetchCollections } from '../firebase/collectionService';
import { auth, db } from '../firebase/firebaseConfig';
import {
  addSubject as createSubject,
  deleteSubject as deleteSubjectFromDb,
  fetchSubjects,
} from '../firebase/subjectService';

import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [dayStreak, setDayStreak] = useState(0);

  
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

  
  const updateStreak = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

    let newStreak = 1;

    if (snap.exists()) {
      const data = snap.data();
      const lastActiveDate = data.lastActiveDate;
      const previousStreak = typeof data.streak === 'number' ? data.streak : 0;

      if (lastActiveDate === todayStr) {
        
        newStreak = previousStreak || 1;
      } else if (lastActiveDate) {
        const lastDate = new Date(lastActiveDate);
        const diffMs = today.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          
          newStreak = previousStreak + 1;
        } else {
          
          newStreak = 1;
        }
      } else {
        
        newStreak = 1;
      }
    }

    await setDoc(
      userRef,
      {
        streak: newStreak,
        lastActiveDate: todayStr,
      },
      { merge: true }
    );

    setDayStreak(newStreak);
  }, []);

  
  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      
      await updateStreak();

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
  }, [updateStreak]);

  
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
      setSuccess('Lënda u shtua me sukses.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.log('Error adding subject:', err);
      setError(err.message ?? 'Nuk u shtua lënda. Provo përsëri.');
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
      setSuccess('Lënda u fshi.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.log('Error deleting subject:', err);
      setError(err.message ?? 'Nuk u fshi lënda.');
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
        subtitle="Mësimet e tua ditore"
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
          {/* Day Streak – TANI dinamike */}
          <StatsCard
            subject={dayStreak.toString()}
            easy={0}
            medium={0}
            hard={0}
            label="Day Streak"
          />

          {/* Cards Done U HEQ – mbesin vetëm Day Streak + Subjects */}
          <StatsCard
            subject={subjects.length.toString()}
            easy={0}
            medium={0}
            hard={0}
            label="Lëndet"
          />
        </View>

        <Text style={styles.title}>Lëndet e tua</Text>

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
              placeholder="Vendos emrin e lëndës"
              value={newSubject}
              onChangeText={setNewSubject}
            />
            <Pressable style={styles.addButton} onPress={handleAddSubject}>
              <Text style={styles.addButtonText}>Shto</Text>
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
        subjectId={item.id}
        subjectName={item.name}
        icon={require('../assets/images/flashcard.png')}
        iconBackgroundColor={item.iconBackgroundColor || '#E0F2FE'}
        collectionCount={item.collectionCount ?? 0}
        onDelete={handleRemoveSubject}
      />
    </Pressable>
  </View>
)}

          ListEmptyComponent={
            !loading && (
              <Text style={{ color: '#777', marginTop: 20 }}>Asnjë lëndë e shtuar deri tani.</Text>
            )
          }
        />
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Pressable style={styles.bottomButton} disabled>
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.bottomButtonText}>Shtëpia</Text>
        </Pressable>

        <Pressable style={styles.bottomButton} onPress={() => router.push('/progress')}>
          <Ionicons name="stats-chart" size={24} color="#007AFF" />
          <Text style={styles.bottomButtonText}>Progresi</Text>
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
