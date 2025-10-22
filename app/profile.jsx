
import { StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/ui/Button';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
      
        <Text style={styles.title}>Profili i Përdoruesit</Text>
        <Text style={styles.subtitle}>Detajet dhe Vendosjet</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Emri:</Text>
          <Text style={styles.infoValue}>Dren Morina</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>user@example.com</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Lëndët e regjistruara:</Text>
          <Text style={styles.infoValue}>4</Text>
        </View>

        <View style={styles.logoutContainer}>
          <Button style={{backgroundColor: '#075eec',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'}} title="Dil (Logout)" onPress={() => router.push('/login')} />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Ngjyra e sfondit
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
    elevation: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  logoutContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    padding: 10,
  }
});
