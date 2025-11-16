import { router } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/ui/Button';
import { auth } from '../firebase';
import { fetchSubjects } from '../firebase/subjectService';

export default function ProfileScreen() {
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const [user, setUser] = useState(auth.currentUser ?? null);

  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/login');
      } else {
        setUser(firebaseUser);
        setAuthReady(true);
      }
    });

    return unsub;
  }, []);

  
  useEffect(() => {
    if (!authReady) return;

    const loadSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjectsCount(data.length);
      } catch (err) {
        console.log('Error fetching subjects in profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [authReady]);

  const displayName =
    user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');

  


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (err) {
      console.log('Error during logout:', err);
    }
  };

  const email = user?.email || 'Nuk ka email';

    const handleChangePassword = () => {
    router.push('/change-password'); // emri i route-it të ri
  };

  if (!authReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Profili i Përdoruesit</Text>
        <Text style={styles.subtitle}>Detajet dhe Vendosjet</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Emri:</Text>
          <Text style={styles.infoValue}>{displayName}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{email}</Text>
        </View>

        

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Lëndët e regjistruara:</Text>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.infoValue}>{subjectsCount}</Text>
          )}
        </View>

                <View style={styles.logoutContainer}>
          <Button
            style={{
              backgroundColor: '#075eec',
              borderRadius: 30,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
            title="Ndrysho fjalëkalimin"
            onPress={handleChangePassword}
          />

          <Button
            style={{
              backgroundColor: '#075eec',
              borderRadius: 30,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Dil (Logout)"
            onPress={handleLogout}
          />
        </View>


        {/* <View style={styles.logoutContainer}>
          <Button
            style={{
              backgroundColor: '#075eec',
              borderRadius: 30,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Dil (Logout)"
            onPress={handleLogout}
          />
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});
