import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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

import Header from '../components/layout/Header';
import { StatsCard } from '../components/ui/StatsCard';
import SubjectCard from '../components/ui/SubjectCard';

import { fetchCollections } from '../firebase/collectionService';
import {
  addSubject as createSubject,
  deleteSubject as deleteSubjectFromDb,
  fetchSubjects,
} from '../firebase/subjectService';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [dayStreak, setDayStreak] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user]);


  const updateStreak = useCallback(async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    const todayStr = new Date().toISOString().slice(0, 10);
    let newStreak = 1;

    if (snap.exists()) {
      const { lastActiveDate, streak = 0 } = snap.data();

      if (lastActiveDate === todayStr) {
        newStreak = streak || 1;
      } else if (lastActiveDate) {
        const diffDays =
          (new Date(todayStr) - new Date(lastActiveDate)) /
          (1000 * 60 * 60 * 24);

        newStreak = diffDays === 1 ? streak + 1 : 1;
      }
    }

    await setDoc(
      userRef,
      { streak: newStreak, lastActiveDate: todayStr },
      { merge: true }
    );

    setDayStreak(newStreak);
  }, [user]);

  const loadSubjects = useCallback(async () => {
    try {
      setDataLoading(true);
      setError('');

      await updateStreak();

      const data = await fetchSubjects();

      const subjectsWithCounts = await Promise.all(
        data.map(async (s) => {
          try {
            const cols = await fetchCollections(s.id);
            return { ...s, collectionCount: cols.length };
          } catch {
            return { ...s, collectionCount: 0 };
          }
        })
      );

      setSubjects(subjectsWithCounts);
    } catch {
      setError('Nuk u ngarkuan lëndët.');
    } finally {
      setDataLoading(false);
    }
  }, [updateStreak]);

  useEffect(() => {
    if (user) {
      loadSubjects();
    }
  }, [user, loadSubjects]);

  
  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      setDataLoading(true);
      const created = await createSubject(newSubject);
      setSubjects((prev) => [...prev, { ...created, collectionCount: 0 }]);
      setNewSubject('');
      setShowInput(false);
      setSuccess('Lënda u shtua.');
      setTimeout(() => setSuccess(''), 2000);
    } catch {
      setError('Nuk u shtua lënda.');
    } finally {
      setDataLoading(false);
    }
  };


  const handleRemoveSubject = async (subjectId) => {
    try {
      await deleteSubjectFromDb(subjectId);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    } catch {
      setError('Nuk u fshi lënda.');
    }
  };


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return null; 
  }


  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />

      <Header
        title="Piqe-Hiqe"
        subtitle="Mësimet e tua ditore"
        rightButton={
          <>
            <Link href="/profile" asChild>
              <Pressable>
                <Ionicons name="person-circle-outline" size={28} color="white" />
              </Pressable>
            </Link>

            <Pressable onPress={() => setShowInput((v) => !v)}>
              <Ionicons name="add" size={28} color="white" />
            </Pressable>
          </>
        }
      />

      <View style={styles.container}>
        <View style={styles.generalStatsContainer}>
          <StatsCard subject={dayStreak.toString()} label="Day Streak" />
          <StatsCard subject={subjects.length.toString()} label="Lëndët" />
        </View>

        <Text style={styles.title}>Lëndet e tua</Text>

        {dataLoading && <ActivityIndicator />}

        {!!error && <Text style={styles.error}>{error}</Text>}
        {!!success && <Text style={styles.success}>{success}</Text>}

        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Emri i lëndës"
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
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <View style={{ width: '48%', marginBottom: 15 }}>
              <SubjectCard
                subjectId={item.id}
                subjectName={item.name}
                collectionCount={item.collectionCount ?? 0}
                onDelete={handleRemoveSubject}
              />
            </View>
          )}
        />
      </View>
    </View>
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
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 10,
  },
  generalStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
  },
  success: {
    color: '#16A34A',
    textAlign: 'center',
  },
});
