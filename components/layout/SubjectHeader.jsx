import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubjectHeader = ({ subject, collectionCount, onBackPress }) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: subject.headerColor }]}>
      <SafeAreaView edges={['top']}>
        {/* Back Button */}
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </Pressable>

        {/* Subject Info */}
        <View style={styles.subjectInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name={subject.icon} size={32} color="white" />
          </View>
          <View style={styles.subjectTextContainer}>
            <Text style={styles.subjectName}>{subject.name}</Text>
            <Text style={styles.collectionCount}>
              {collectionCount} {collectionCount === 1 ? 'collection' : 'collections'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SubjectHeader;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectTextContainer: {
    flex: 1,
  },
  subjectName: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
