import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/layout/Header';
import AnimatedButton from '../components/ui/AnimatedButton';
import { auth } from '../firebase/firebaseConfig';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentFocused, setCurrentFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [user, setUser] = useState(auth.currentUser ?? null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) router.replace('/login');
      else setUser(firebaseUser);
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
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert('Sukses', 'Fjalëkalimi u ndryshua me sukses.');
      router.back();
    } catch (error) {
      console.log('CHANGE PASSWORD ERROR:', error.code, error.message);
      if (error.code === 'auth/wrong-password') Alert.alert('Gabim', 'Fjalëkalimi aktual nuk është i saktë.');
      else if (error.code === 'auth/weak-password') Alert.alert('Gabim', 'Fjalëkalimi i ri është shumë i dobët.');
      else Alert.alert('Gabim', 'Ndodhi një gabim gjatë ndryshimit të fjalëkalimit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
          <Header
            backgroundColor='#4bb8e7ff'
            showBack={true}
            showHome
            onBackPress={() => router.back()}
          />
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            contentFit="contain"
            style={styles.headerImg}
            source={require('./../assets/images/logo.jpg')}
            cachePolicy="memory-disk"
            transition={200}
          />
          <Text style={styles.title}>Ndrysho fjalëkalimin</Text>
        </View>

        {/* Current Password */}
        <View style={styles.igInputContainer}>
          <Text style={[styles.igLabel, (currentFocused || currentPassword) && styles.igLabelActive]}>
            Fjalëkalimi aktual
          </Text>
          <TextInput
            style={[styles.igInput, currentFocused && styles.igInputFocused]}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            onFocus={() => setCurrentFocused(true)}
            onBlur={() => setCurrentFocused(false)}
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* New Password */}
        <View style={styles.igInputContainer}>
          <Text style={[styles.igLabel, (newFocused || newPassword) && styles.igLabelActive]}>
            Fjalëkalimi i ri
          </Text>
          <TextInput
            style={[styles.igInput, newFocused && styles.igInputFocused]}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            onFocus={() => setNewFocused(true)}
            onBlur={() => setNewFocused(false)}
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.igInputContainer}>
          <Text style={[styles.igLabel, (confirmFocused || confirmPassword) && styles.igLabelActive]}>
            Konfirmo fjalëkalimin e ri
          </Text>
          <TextInput
            style={[styles.igInput, confirmFocused && styles.igInputFocused]}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setConfirmFocused(true)}
            onBlur={() => setConfirmFocused(false)}
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.actions}>
          <AnimatedButton
            title={loading ? 'Duke ndryshuar...' : 'Ndrysho fjalëkalimin'}
            onPress={handleChangePassword}
            style={styles.btn}
            textStyle={styles.btnText}
          />
        </View>
      </View>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
     flex: 1,
     backgroundColor: '#ffffffff'
     },
  container: { 
    flex: 1,
    padding: 20 
    },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:15,
      },
  headerImg: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 20 
      },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8, 
    textAlign: 'center', 
    color: '#1a1a1a' 
      },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24 
      },
  igInputContainer: {
     position: 'relative',
     marginBottom: 16 
      },
  igLabel: {
    position: 'absolute', 
    left: 12, 
    top: 15, 
    fontSize: 16, 
    color: '#8e8e8e', 
    zIndex: 1 },
  igLabelActive: {
    top: 6, 
    fontSize: 11 
      },
  igInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 20,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#8e8e8e',
    color: '#111827',
  },
  igInputFocused: { backgroundColor: '#f4f6fa' },
  actions: { marginTop: 24 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#4bb8e7ff',
    borderColor: '#4bb8e7ff',
  },
  btnText: { fontSize: 18, fontWeight: '600', color: '#fff' },
});

