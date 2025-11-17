import { useRouter } from 'expo-router';
import { FlatList, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/layout/Header';
import { StatsCard } from '../components/ui/StatsCard';

const SUBJECT_PROGRESS_DATA = [
  { id: 1, subject: 'Matematikë', easy: 40, medium: 35, hard: 25 },
  { id: 2, subject: 'Fizikë', easy: 55, medium: 30, hard: 15 },
  { id: 3, subject: 'Elektronikë', easy: 30, medium: 40, hard: 30 },
  { id: 4, subject: 'Programim', easy: 60, medium: 30, hard: 10 },
];

export default function ProgressScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Header
        backgroundColor="#a2e361ff"
        title="Progress"
        subtitle="Your study performance"
        icon="stats-chart"
        showBack
        onBackPress={() => router.back()}
      />
      <SafeAreaView style={styles.contentArea} edges={['bottom']}>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});
