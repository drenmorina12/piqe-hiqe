import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import InputField from '../components/InputField';

export default function SignupScreen() {
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const handleSignUp = () => {
    if (
      !form.name ||
      !form.lastname ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert('Ju lutem plotësoni të gjitha fushat.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Fjalëkalimet nuk përputhen.');
      return;
    }

    alert('Llogaria u krijua me sukses!');
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
          <Text style={styles.title}>
            Krijoje <Text style={{ color: '#075eec' }}>llogarinë</Text> tuaj
          </Text>
          <Text style={styles.subtitle}>
            Bashkohu me Piqe-Hiqe dhe fillo të mësosh më zgjuarsi
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <InputField
                label="Emri"
                value={form.name}
                placeholder="Filan"
                onChangeText={(name) => setForm({ ...form, name })}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <InputField
                label="Mbiemri"
                value={form.lastname}
                placeholder="Fisteku"
                onChangeText={(lastname) => setForm({ ...form, lastname })}
              />
            </View>
          </View>

          <InputField
            label="Email adresa"
            value={form.email}
            placeholder="filan@example.com"
            keyboardType="email-address"
            onChangeText={(email) => setForm({ ...form, email })}
          />

          <InputField
            label="Fjalëkalimi"
            value={form.password}
            placeholder="********"
            secureTextEntry
            onChangeText={(password) => setForm({ ...form, password })}
          />

          <InputField
            label="Konfirmo fjalëkalimin"
            value={form.confirmPassword}
            placeholder="********"
            secureTextEntry
            onChangeText={(confirmPassword) =>
              setForm({ ...form, confirmPassword })
            }
          />

          <View style={styles.formAction}>
            <Button title="Regjistrohu" onPress={handleSignUp} />
          </View>

          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.formLink}>
              Keni tashmë një llogari?{' '}
              <Text
                style={{
                  textDecorationLine: 'underline',
                  color: '#075eec',
                }}>
                Identifikohu
              </Text>
            </Text>
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
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 30,
  },
  form: {
    flexGrow: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});
