import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 160;
const STROKE_WIDTH = 22;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CollectionProgressPie({ progress }) {
  const { easy = 0, medium = 0, hard = 0 } = progress || {};
  const total = easy + medium + hard;

  if (total === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No progress yet</Text>
      </View>
    );
  }

  const easyRatio = easy / total;
  const mediumRatio = medium / total;
  const hardRatio = hard / total;

  const easyLength = CIRCUMFERENCE * easyRatio;
  const mediumLength = CIRCUMFERENCE * mediumRatio;
  const hardLength = CIRCUMFERENCE * hardRatio;

  return (
    <View style={styles.container}>

      <Svg width={SIZE} height={SIZE}>
        {/* Background */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#E5E7EB"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Easy */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#22C55E"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${easyLength} ${CIRCUMFERENCE}`}
          strokeDashoffset={0}
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />

        {/* Medium */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#FACC15"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${mediumLength} ${CIRCUMFERENCE}`}
          strokeDashoffset={-easyLength}
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />

        {/* Hard */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#EF4444"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${hardLength} ${CIRCUMFERENCE}`}
          strokeDashoffset={-(easyLength + mediumLength)}
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <Legend color="#22C55E" label={`Easy (${easy})`} />
        <Legend color="#FACC15" label={`Medium (${medium})`} />
        <Legend color="#EF4444" label={`Hard (${hard})`} />
      </View>
    </View>
  );
}

function Legend({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  legend: {
    marginTop: 16,
    width: '70%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    marginVertical: 24,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
