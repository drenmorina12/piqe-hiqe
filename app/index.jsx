import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/layout/Header';
import SubjectCard from '../components/ui/SubjectCard';

export default function HomeScreen() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [showInput, setShowInput] = useState(false);

  const addSubject = () => {
    if (newSubject.trim() !== '') {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
      setShowInput(false);
    }
  };

  const removeSubject = (subject) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Piqe-Hiqe"
        subtitle="Your daily lessons"
        rightButton={<Ionicons name="add" size={28} color="white" />}
        onRightPress={() => setShowInput(!showInput)}
      />

      <View style={styles.container}>
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
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15 }}>
              <SubjectCard subjectName={item} icon={require('../assets/images/flashcard.png')} iconBackgroundColor="#bcdee1ff" collectionCount={5}
            />
              <Pressable onPress={() => removeSubject(item)} style={{ marginTop: 4, alignSelf: 'flex-end' }}>
                <Ionicons name="trash" size={22} color="green"  />
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

            <Link href="/profile" asChild>
              <Pressable style={styles.link}>
                <Text style={styles.linkText}>Profile</Text>
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
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
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

  linksWrapper: {
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
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
