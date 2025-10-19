import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const CollectionCard = ({ collection, onPress, gradientColors }) => {
  const progress = collection.cards > 0 ? (collection.completed / collection.cards) * 100 : 0;
  const isCompleted = collection.completed === collection.cards && collection.cards > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconWrapper, isCompleted ? styles.iconCompleted : styles.iconDefault]}>
          <Ionicons
            name="folder-open"
            size={24}
            color={isCompleted ? '#059669' : '#4F46E5'}
          />
        </View>

        {/* Collection Info */}
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {collection.name}
            </Text>
            {isCompleted && (
              <View style={styles.completeBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.completeText}>Complete</Text>
              </View>
            )}
          </View>

          <Text style={styles.cardCount}>
            {collection.completed} / {collection.cards} cards
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                isCompleted ? styles.progressBarComplete : styles.progressBarIncomplete,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default CollectionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    gap: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDefault: {
    backgroundColor: '#F9FAFB',
  },
  iconCompleted: {
    backgroundColor: '#D1FAE5',
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  cardCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressBarIncomplete: {
    backgroundColor: '#4F46E5',
  },
  progressBarComplete: {
    backgroundColor: '#10B981',
  },
});
