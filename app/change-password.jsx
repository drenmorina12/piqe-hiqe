import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';
import Button from '../components/ui/Button';
import { auth } from '../firebase';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(auth.currentUser ?? null);
  const [loading, setLoading] = useState(false);

  // sigurohemi që user-i është i loguar
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/login');
      } else {
        setUser(firebaseUser);
      }
    });

    return unsub;
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Gabim', 'Ju lutem mbushni të gjitha fushat.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Gabim', 'Fjalëkalimi i ri duhet të ketë së paku 6 karaktere.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Gabim', 'Fjalëkalimi i ri dhe konfirmimi nuk përputhen.');
      return;
    }

    if (!user || !user.email) {
      Alert.alert('Gabim', 'Nuk u gjet përdoruesi aktual. Provoni të hyni sërish.');
      router.replace('/login');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Re-authenticate me current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      await reauthenticateWithCredential(user, credential);

      // 2️⃣ Update password me të riun
      await updatePassword(user, newPassword);

      Alert.alert('Sukses', 'Fjalëkalimi u ndryshua me sukses.');
      router.back(); // kthehu te profili (ose router.replace('/profile'))
    } catch (error) {
      console.log('CHANGE PASSWORD ERROR:', error.code, error.message);

      if (error.code === 'auth/wrong-password') {
        Alert.alert('Gabim', 'Fjalëkalimi aktual nuk është i saktë.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Gabim', 'Fjalëkalimi i ri është shumë i dobët.');
      } else {
        Alert.alert('Gabim', 'Ndodhi një gabim gjatë ndryshimit të fjalëkalimit.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Ndrysho fjalëkalimin</Text>
        <Text style={styles.subtitle}>
          Për siguri, së pari shkruani fjalëkalimin aktual dhe pastaj të riun.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fjalëkalimi aktual</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Fjalëkalimi aktual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fjalëkalimi i ri</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Fjalëkalimi i ri"
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Konfirmo fjalëkalimin e ri</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Konfirmo fjalëkalimin e ri"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title={loading ? 'Duke ndryshuar...' : 'Ndrysho fjalëkalimin'}
            onPress={handleChangePassword}
            style={{
              backgroundColor: '#075eec',
              borderRadius: 30,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
            }}
          />
        </View>
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
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },
  actions: {
    marginTop: 24,
  },
});
