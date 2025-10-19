
import { StyleSheet, Text, View } from 'react-native';

const StatsCard = ({ subject, easy, medium, hard, label }) => {
  const isGeneralStat = label !== undefined;

  return (
    <View style={[styles.card, isGeneralStat && styles.generalCard]}>
      
      <Text style={[styles.subjectTitle, isGeneralStat && styles.generalValue]}>
          {subject} 
      </Text>
      
      {isGeneralStat && (
        <Text style={styles.generalLabel}>{label}</Text>
      )}

      {!isGeneralStat && (
        <View style={styles.statsGroup}>
          
          <View style={styles.statItem}>
            <View style={[styles.progressCircle, styles.easyColor]}>
              <Text style={styles.progressText}>{easy}%</Text>
            </View>
            <Text style={styles.statLabel}>Lehtë</Text>
            <Text style={styles.statValue}>{Math.round(easy * 10)}</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.progressCircle, styles.mediumColor]}>
              <Text style={styles.progressText}>{medium}%</Text>
            </View>
            <Text style={styles.statLabel}>Mesatare</Text>
            <Text style={styles.statValue}>{Math.round(medium * 10)}</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.progressCircle, styles.hardColor]}>
              <Text style={styles.progressText}>{hard}%</Text>
            </View>
            <Text style={styles.statLabel}>Vështirë</Text>
            <Text style={styles.statValue}>{Math.round(hard * 10)}</Text>
          </View>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1, 
    borderColor: '#eee',
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsGroup: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center', 
    flex: 1, 
    marginHorizontal: 5,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  easyColor: { backgroundColor: '#87d068' }, 
  mediumColor: { backgroundColor: '#ffc107' }, 
  hardColor: { backgroundColor: '#f55d5d' }, 
  
  generalCard: {
    flex: 1, 
    height: 120, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: 5,
  },
  generalValue: {
    fontSize: 30, 
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#8A2BE2', 
  },
  generalLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  }
});

export { StatsCard };
