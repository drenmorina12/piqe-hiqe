import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const AnimatedButton = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary', // 'primary', 'danger', 'secondary'
}) => {
  const { colors } = useTheme();

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

  // ✅ vetëm ngjyrat i marrim prej theme (pa prek logjikën/strukturën)
  const themeVariantStyle = useMemo(() => {
    switch (variant) {
      case 'danger':
        return {
          backgroundColor: colors.danger ?? '#EF4444',
        };
      case 'secondary':
        return {
          backgroundColor: colors.card ?? colors.background ?? '#FFFFFF',
          borderColor: colors.border ?? '#D1D5DB',
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary ?? colors.tint ?? '#4F46E5',
        };
    }
  }, [variant, colors]);

  const themeTextVariantStyle = useMemo(() => {
    switch (variant) {
      case 'secondary':
        return {
          color: colors.text ?? '#111827',
        };
      case 'danger':
      case 'primary':
      default:
        return {
          color: colors.onPrimary ?? '#FFFFFF',
        };
    }
  }, [variant, colors]);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled}
      style={[variantStyle, themeVariantStyle, disabled && styles.disabled, style]}
    >
      <Text style={[textVariantStyle, themeTextVariantStyle, textStyle]}>{title}</Text>
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
