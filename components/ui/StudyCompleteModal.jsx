import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import AnimatedModal from './AnimatedModal';

export default function StudyCompleteModal({ visible, onClose }) {
  const [shoot, setShoot] = useState(false);

  useEffect(() => {
    if (visible) {
      setShoot(true);
      const t = setTimeout(() => setShoot(false), 4000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        {shoot && (
          <ConfettiCannon
            count={140}
            origin={{ x: 180, y: 0 }}
            explosionSpeed={350}
            fallSpeed={2500}
            fadeOut={false}
            />

        )}

        <Text style={styles.title}>Session completed 🎉</Text>

        <Text style={styles.subtitle}>
          You’ve finished all flashcards in this study session.
        </Text>

        <Pressable style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Done</Text>
        </Pressable>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
