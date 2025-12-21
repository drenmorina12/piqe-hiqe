import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export default function Toast({ message, type = 'success', visible, onHide, duration = 3000 }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible && message) {
      // Fade in and slide down
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, message]);

  if (!visible || !message) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: styles.successContainer,
          icon: 'checkmark-circle',
          iconColor: '#10B981',
        };
      case 'error':
        return {
          container: styles.errorContainer,
          icon: 'close-circle',
          iconColor: '#EF4444',
        };
      case 'info':
        return {
          container: styles.infoContainer,
          icon: 'information-circle',
          iconColor: '#3B82F6',
        };
      default:
        return {
          container: styles.successContainer,
          icon: 'checkmark-circle',
          iconColor: '#10B981',
        };
    }
  };

  const { container, icon, iconColor } = getStyles();

  return (
    <Animated.View
      style={[
        styles.toast,
        container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 9999,
    gap: 12,
  },
  successContainer: {
    backgroundColor: '#ECFDF5',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  infoContainer: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
});
