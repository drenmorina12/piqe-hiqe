import { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function AnimatedModal({ visible, onClose, children }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: visible ? 300 : 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            { opacity, backgroundColor: colors.overlay ?? 'rgba(0,0,0,0.4)' },
          ]}
        >
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[
                styles.modalContent,
                { backgroundColor: colors.card ?? colors.background ?? '#fff' },
              ]}
            >
              {children}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
});
