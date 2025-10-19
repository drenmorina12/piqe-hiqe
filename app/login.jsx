import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import InputField from '../components/InputField';

export default function LoginScreen() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleSignIn = () => {
    if (!form.email || !form.password) {
      alert('Please fill in both email and password.');
      return;
    }
    router.replace('/homepage');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={require('./../assets/images/login.png')}
          />
          <Text style={styles.title}>Mirë se erdhët në</Text>
          <Text style={[styles.title, { color: '#075eec' }]}>Piqe-Hiqe</Text>
          <Text style={styles.subtitle}>Mëso me zgjuarsi, jo me lodhje</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <InputField
            label="Email adresa"
            value={form.email}
            onChangeText={email => setForm({ ...form, email })}
            placeholder="filan@example.com"
            keyboardType="email-address"
          />

          <InputField
            label="Fjalëkalimi"
            value={form.password}
            onChangeText={password => setForm({ ...form, password })}
            placeholder="********"
            secureTextEntry
          />

          <View style={styles.formAction}>
            <Button title="Identifikohu" onPress={handleSignIn} />
          </View>

          <TouchableOpacity onPress={() => router.push('/forgotpassword')}>
            <Text style={styles.formLink}>Kam harruar fjalëkalimin?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.formFooter}>
          Nuk keni një llogari?{' '}
          <Text style={{ textDecorationLine: 'underline', color: '#075eec' }}>
            Regjistrohu
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  form: {
    flexGrow: 1,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
});
