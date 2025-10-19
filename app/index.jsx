import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/layout/Header';
import { StatsCard } from '../components/ui/StatsCard';
import SubjectCard from '../components/ui/SubjectCard';
import { MOCK_SUBJECTS } from '../constants/mockData';

export default function HomeScreen() {
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [newSubject, setNewSubject] = useState('');
  const [showInput, setShowInput] = useState(false);

  const addSubject = () => {
    if (newSubject.trim() !== '') {
      const newSubjectData = {
        id: Date.now().toString(),
        name: newSubject.trim(),
        icon: 'book',
        iconBackgroundColor: '#E0F2FE',
        headerColor: '#3B82F6',
        collections: [],
      };
      setSubjects([...subjects, newSubjectData]);
      setNewSubject('');
      setShowInput(false);
    }
  };

  const removeSubject = (subjectId) => {
    setSubjects(subjects.filter((s) => s.id !== subjectId));
  };

  const handleSubjectPress = (subject) => {
    router.push(`/subjects/${subject.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter subject name"
              value={newSubject}
              onChangeText={setNewSubject}
            />
            <Pressable style={styles.addButton} onPress={addSubject}>
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        )}

        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15 }}>
              <Pressable onPress={() => handleSubjectPress(item)}>
                <SubjectCard
                  subjectName={item.name}
                  icon={require('../assets/images/flashcard.png')}
                  iconBackgroundColor={item.iconBackgroundColor}
                  collectionCount={item.collections.length}
                />
              </Pressable>
              <Pressable
                onPress={() => removeSubject(item.id)}
                style={{ marginTop: 4, alignSelf: 'flex-end' }}
              >
                <Ionicons name="trash" size={22} color="#EF4444" />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#777', marginTop: 20 }}>No subjects added yet.</Text>
          }
        />

        <View style={styles.linksWrapper}>
          <View style={styles.linksContainer}>
            <Link href="/subjects" asChild>
              <Pressable style={styles.link}>
                <Text style={styles.linkText}>Subjects</Text>
              </Pressable>
            </Link>

            <Link href="/progress" asChild>
              <Pressable style={styles.link}>
                <Text style={styles.linkText}>Shiko Progresin</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    width: 200,
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
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    width: 250,
  },
  subjectText: {
    fontSize: 16,
  },
  generalStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: '100%',
    marginBottom: 20,
  },

  linksWrapper: {
    paddingVertical: 20,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flex: 1,
    justifyContent: 'center',
  },
  linksContainer: {
    alignItems: 'center',
    gap: 15,
  },
  link: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    width: '100%',
    flexGrow: 1,
  },
});
