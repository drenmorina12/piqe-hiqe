import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
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

import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/layout/Header';
import AnimatedModal from '../components/ui/AnimatedModal';
import { StatsCard } from '../components/ui/StatsCard';
import SubjectCard from '../components/ui/SubjectCard';
import Toast from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { fetchCollections } from '../firebase/collectionService';
import { auth, db } from '../firebase/firebaseConfig';
import {
  addSubject as createSubject,
  deleteSubject as deleteSubjectFromDb,
  fetchSubjects,
} from '../firebase/subjectService';

import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();

  const { user, loading: authLoading } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('error');
  const [success, setSuccess] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [dayStreak, setDayStreak] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user]);

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
    if (user) {
      loadSubjects();
    }
  }, [user, loadSubjects]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadSubjects();
      }
    }, [user, loadSubjects])
  );

  const handleAddSubject = useCallback(async () => {
    if (!newSubject.trim()) return;

    try {
      setLoading(true);
      setError('');
      const created = await createSubject(newSubject);
      const createdWithCount = { ...created, collectionCount: 0 };

      setSubjects((prev) => [...prev, createdWithCount]);
      setNewSubject('');
      setShowInput(false);
      setSuccess('Lënda u krijua me sukses');
    } catch (err) {
      console.log('Gabim gjatë shtimit të lëndës:', err);
      setError(err.message ?? 'Krijimi i lëndës dështoi. Ju lutemi provoni përsëri.');
      setErrorType('error');
    } finally {
      setLoading(false);
    }
  }, [newSubject]);

  const handleRemoveSubject = useCallback(async (subjectId) => {
    try {
      setLoading(true);
      setError('');
      await deleteSubjectFromDb(subjectId);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      setSuccess('Lënda u fshi me sukses');
    } catch (err) {
      console.log('Error deleting subject:', err);
      setError(err.message ?? 'Fshirja e lëndës dështoi. Ju lutemi provoni përsëri.');
      setErrorType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubjectPress = useCallback((subject) => {
    router.push({
      pathname: '/subjects/[id]',
      params: { id: subject.id },
    });
  }, []);

  const keyExtractor = useCallback((item) => item.id, []);

  const renderSubjectItem = useCallback(
    ({ item }) => (
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
    ),
    [handleSubjectPress, handleRemoveSubject]
  );

  if (authLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary ?? colors.tint} />
      </View>
    );
  }

  const accent = colors.primary ?? colors.tint ?? '#2563EB';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        style={isDark ? 'light' : 'dark'}
        backgroundColor={accent}
      />

      {/* HEADER */}
      <Header
        title="Piqe-Hiqe"
        subtitle="Mësimet e tua ditore"
        rightButton={
          <>
            <Link href="/profile" asChild>
              <Pressable>
                <Ionicons name="person-circle-outline" size={28} color={ 'white'} />
              </Pressable>
            </Link>
          </>
        }
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.generalStatsContainer}>
          <StatsCard
            subject={dayStreak.toString()}
            easy={0}
            medium={0}
            hard={0}
            label="Ditët"
          />

          <StatsCard
            subject={subjects.length.toString()}
            easy={0}
            medium={0}
            hard={0}
            label="Lëndet"
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Lëndet e tua</Text>

        {loading && (
          <View style={{ marginBottom: 10 }}>
            <ActivityIndicator color={accent} />
          </View>
        )}

        {!!error && (
          <Text style={{ color: '#EF4444', marginBottom: 8, textAlign: 'center' }}>{error}</Text>
        )}

        {!!success && (
          <Text style={{ color: '#16A34A', marginBottom: 8, textAlign: 'center' }}>{success}</Text>
        )}

        <FlatList
          data={subjects}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
          contentContainerStyle={{ paddingVertical: 10, paddingBottom: 100 }}
          renderItem={renderSubjectItem}
          ListEmptyComponent={
            !loading && (
              <Text style={{ color: colors.mutedText ?? '#777', marginTop: 20 }}>
                Asnjë lëndë e shtuar deri tani.
              </Text>
            )
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={10}
        />
      </View>

      <AnimatedModal visible={showInput} onClose={() => setShowInput(false)}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: colors.text }}>
          Shto lëndë të re
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border ?? '#ccc',
              backgroundColor: colors.inputBg ?? colors.card ?? colors.background,
              color: colors.text,
            },
          ]}
          placeholder="Vendos emrin e lëndës"
          placeholderTextColor={colors.placeholder ?? colors.mutedText ?? '#9CA3AF'}
          value={newSubject}
          onChangeText={setNewSubject}
        />

        <TouchableOpacity
          style={[
            styles.addButton,
            { marginTop: 16, marginBottom: 8, backgroundColor: accent },
          ]}
          activeOpacity={0.6}
          onPress={handleAddSubject}
        >
          <Text style={[styles.addButtonText, { color: '#fff' }]}>Shto</Text>
        </TouchableOpacity>
      </AnimatedModal>

      <SafeAreaView
        edges={['bottom']}
        style={[styles.footerSafe, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.background, borderTopColor: colors.border ?? '#E5E7EB' },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.footerButton,
              {
                backgroundColor: colors.card ?? colors.background,
                borderColor: accent,
              },
            ]}
            activeOpacity={0.6}
            onPress={() => setShowInput(!showInput)}
          >
            <Ionicons name="add" size={34} color={accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.footerButton,
              {
                backgroundColor: colors.card ?? colors.background,
                borderColor: accent,
              },
            ]}
            activeOpacity={0.6}
            onPress={() => router.push('/timer')}
          >
            <Ionicons name="stopwatch-outline" size={26} color={accent} />
            <Text style={[styles.footerText, { color: accent }]}>Timer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Toast message={success} type="success" visible={!!success} onHide={() => setSuccess('')} />
      <Toast message={error} type={errorType} visible={!!error} onHide={() => setError('')} />
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
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 48,
    width: '100%',
  },

  addButton: {
    backgroundColor: '#007AFF',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
  footerSafe: {
    backgroundColor: '#fff',
  },

  footer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },

  footerButton: {
    flex: 1,
    height: 58,
    borderRadius: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,

    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2563EB',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },

  footerText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});
