import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedButton from './AnimatedButton';
import ProgressBar from './ProgressBar';

const CollectionCard = ({ collection, onPress, gradientColors, onDelete }) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const openOptions = useCallback(() => setOptionsVisible(true), []);
  const closeOptions = useCallback(() => setOptionsVisible(false), []);

  const openConfirm = useCallback(() => {
    setOptionsVisible(false);
    setConfirmVisible(true);
  }, []);

  const closeConfirm = useCallback(() => setConfirmVisible(false), []);

  const handleConfirmDelete = useCallback(() => {
    setConfirmVisible(false);
    if (onDelete && collection?.id) {
      onDelete(collection.id);
    }
  }, [onDelete, collection?.id]);

  const progress = collection.cards > 0 ? (collection.completed / collection.cards) * 100 : 0;
  const isCompleted = collection.completed === collection.cards && collection.cards > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconWrapper, isCompleted ? styles.iconCompleted : styles.iconDefault]}>
          <Ionicons name="folder-open" size={24} color={isCompleted ? '#059669' : '#4F46E5'} />
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

          <ProgressBar
            value={progress}
            height={8}
            trackColor="#E5E7EB"
            fillColor={isCompleted ? '#10B981' : (gradientColors?.[1] ?? '#4F46E5')}
            style={{}}
          />
        </View>
      </View>

      {/* 3 pikat – nuk e prishin layout-in */}
      <TouchableOpacity style={styles.menuButton} onPress={openOptions}>
        <Ionicons name="ellipsis-vertical" size={18} color="#4B5563" />
      </TouchableOpacity>

      {/* Modal 1: Options */}
      <Modal
        visible={optionsVisible}
        transparent
        animationType="fade"
        onRequestClose={closeOptions}
      >
        <Pressable style={styles.backdrop} onPress={closeOptions}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Options</Text>

            <AnimatedButton
              title="Delete collection"
              variant="danger"
              onPress={openConfirm}
              style={styles.modalButtonSpacing}
            />

            <AnimatedButton
              title="Cancel"
              variant="secondary"
              onPress={closeOptions}
              style={styles.modalButtonSpacing}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Modal 2: Confirm delete */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={closeConfirm}
      >
        <Pressable style={styles.backdrop} onPress={closeConfirm}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirm delete</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this collection?</Text>

            <AnimatedButton
              title="Yes, delete"
              variant="danger"
              onPress={handleConfirmDelete}
              style={styles.modalButtonSpacing}
            />

            <AnimatedButton
              title="Cancel"
              variant="secondary"
              onPress={closeConfirm}
              style={styles.modalButtonSpacing}
            />
          </View>
        </Pressable>
      </Modal>
    </Pressable>
  );
};

export default memo(CollectionCard);

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
  info: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
    marginRight: 28,
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
  // Shtesat për 3 pikat dhe modalet
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  modalText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  modalButtonSpacing: {
    marginTop: 8,
  },
});
