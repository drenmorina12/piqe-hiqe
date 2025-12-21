import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const AnimatedButton = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary', // 'primary', 'danger', 'secondary'
}) => {
  const variantStyle = useMemo(() => {
    switch (variant) {
      case 'danger':
        return styles.buttonDanger;
      case 'secondary':
        return styles.buttonSecondary;
      case 'primary':
      default:
        return styles.button;
    }
  }, [variant]);

  const textVariantStyle = useMemo(() => {
    switch (variant) {
      case 'danger':
        return styles.textDanger;
      case 'secondary':
        return styles.textSecondary;
      case 'primary':
      default:
        return styles.text;
    }
  }, [variant]);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled}
      style={[variantStyle, disabled && styles.disabled, style]}
    >
      <Text style={[textVariantStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textDanger: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textSecondary: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
