import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatsCard } from '../components/ui/StatsCard';

const SUBJECT_PROGRESS_DATA = [
  { id: 1, subject: 'Matematikë', easy: 40, medium: 35, hard: 25 },
  { id: 2, subject: 'Fizikë', easy: 55, medium: 30, hard: 15 },
  { id: 3, subject: 'Elektronikë', easy: 30, medium: 40, hard: 30 },
  { id: 4, subject: 'Programim', easy: 60, medium: 30, hard: 10 },
];

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <Text style={styles.title}>Progresi i Përdoruesit</Text>
        
        <FlatList
          data={SUBJECT_PROGRESS_DATA}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StatsCard
              subject={item.subject}
              easy={item.easy}
              medium={item.medium}
              hard={item.hard}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 25,
    color: '#1a1a1a',
  },
  listContent: {
    paddingBottom: 20,
  },
});
