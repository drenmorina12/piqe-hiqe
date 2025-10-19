import { StyleSheet, View } from 'react-native';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function ProgressBar({
  value = 0,
  height = 8,
  trackColor = '#E5E7EB',
  fillColor = '#4F46E5',
  radius,               
  style,
}) {
  const percent = clamp(value > 1 ? value : value * 100, 0, 100);
  const r = radius ?? height / 2;

  return (
    <View style={[styles.container, { height, borderRadius: r, backgroundColor: trackColor }, style]}>
      <View style={[styles.fill, { width: `${percent}%`, borderRadius: r, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
