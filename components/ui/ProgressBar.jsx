import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function ProgressBar({
  value = 0,
  height = 8,
  trackColor, // ✅ mos e default këtu, e vendosim poshtë me theme
  fillColor,  // ✅
  radius,
  style,
}) {
  const { colors } = useTheme();

  const resolvedTrackColor = trackColor ?? (colors.border ?? '#E5E7EB');
  const resolvedFillColor = fillColor ?? (colors.primary ?? colors.tint ?? '#4F46E5');

  const percent = clamp(value > 1 ? value : value * 100, 0, 100);
  const r = radius ?? height / 2;

  return (
    <View
      style={[
        styles.container,
        { height, borderRadius: r, backgroundColor: resolvedTrackColor },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          { width: `${percent}%`, borderRadius: r, backgroundColor: resolvedFillColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
