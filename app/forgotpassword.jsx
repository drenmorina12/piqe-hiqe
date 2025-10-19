import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import InputField from '../components/InputField';

export default function ForgotPasswordScreen() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const handleResetPassword = () => {
    if (!form.email || !form.password || !form.confirmPassword) {
      alert('Ju lutem plotësoni të gjitha fushat.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Fjalëkalimet nuk përputhen.');
      return;
    }

    alert('Fjalëkalimi u përditësua me sukses!');
    router.replace('/');
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
          <Text style={styles.title}>
            Rivendosni <Text style={{ color: '#075eec' }}>Fjalëkalimin</Text>
          </Text>
          <Text style={styles.subtitle}>
            Shkruani emailin tuaj dhe vendosni një fjalëkalim të ri për të
            vazhduar.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <InputField
            label="Email adresa"
            value={form.email}
            placeholder="filan@example.com"
            keyboardType="email-address"
            onChangeText={(email) => setForm({ ...form, email })}
          />

          <InputField
            label="Fjalëkalim i ri"
            value={form.password}
            placeholder="********"
            secureTextEntry
            onChangeText={(password) => setForm({ ...form, password })}
          />

          <InputField
            label="Konfirmo fjalëkalimin e ri"
            value={form.confirmPassword}
            placeholder="********"
            secureTextEntry
            onChangeText={(confirmPassword) =>
              setForm({ ...form, confirmPassword })
            }
          />

          <View style={styles.formAction}>
            <Button title="Përditëso Fjalëkalimin" onPress={handleResetPassword} />
          </View>

          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.formLink}>Kthehu tek Identifikimi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  form: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formAction: {
    marginTop: 10,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
});
