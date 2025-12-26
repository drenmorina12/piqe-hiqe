import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo, useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedButton from './AnimatedButton';

const SubjectCard = ({
  icon,
  subjectName,
  iconBackgroundColor,
  collectionCount,
  // për logjikë:
  subjectId,
  onDelete,
}) => {
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
    if (onDelete && subjectId) {
      onDelete(subjectId);
    }
  }, [onDelete, subjectId]);

  return (
    <View testID="subject-card" style={styles.card}>
      {/* UI JOTE EKZISTUESE – e paprekur */}
      <View style={[styles.iconWrapper, { backgroundColor: iconBackgroundColor }]}>
        <Image
          source={icon}
          style={styles.icon}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      </View>
      <Text style={styles.subjectText}>{subjectName}</Text>
      {collectionCount !== undefined && (
        <Text style={styles.collectionText}>
          {collectionCount} {collectionCount === 1 ? 'koleksion' : 'koleksione'}
        </Text>
      )}

      {/* 3 pikat – vetëm kjo pjesë e re SHFAQET në kartelë */}
      <TouchableOpacity testID="subject-menu" style={styles.menuButton} onPress={openOptions}>
        <Ionicons name="ellipsis-vertical" size={18} color="#4B5563" />
      </TouchableOpacity>

      {/* Modal 1 – Options (Delete / Cancel) */}
      <Modal
        visible={optionsVisible}
        transparent
        animationType="fade"
        onRequestClose={closeOptions}
      >
        <Pressable style={styles.backdrop} onPress={closeOptions}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Opsione</Text>

            <AnimatedButton
              testID="subject-delete"
              title="Fshi lëndën"
              variant="danger"
              onPress={openConfirm}
              style={styles.modalButtonSpacing}
            />

            <AnimatedButton
              testID="subject-cancel-options"
              title="Anulo"
              variant="secondary"
              onPress={closeOptions}
              style={styles.modalButtonSpacing}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Modal 2 – Confirm delete */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={closeConfirm}
      >
        <Pressable style={styles.backdrop} onPress={closeConfirm}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Konfirmo fshirjen</Text>
            <Text style={styles.modalText}>Jeni i sigurt që dëshironi ta fshini këtë lëndë?</Text>

            <AnimatedButton
              testID="subject-confirm-delete"
              title="Po, fshi"
              variant="danger"
              onPress={handleConfirmDelete}
              style={styles.modalButtonSpacing}
            />

            <AnimatedButton
              testID="subject-cancel-options"
              title="Anulo"
              variant="secondary"
              onPress={closeConfirm}
              style={styles.modalButtonSpacing}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default memo(SubjectCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 13,
    width: 160,
    height: 150,
    alignItems: 'flex-start',
    elevation: 4,
    shadowColor: '#071638ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 7,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
  },
  icon: {
    width: 60,
    height: 60,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000ff',
  },
  collectionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  /* SHTESA PËR 3-PIKAT + MODALET – nuk prekin layout-in e vjetër */
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    backgroundColor: 'white',
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
