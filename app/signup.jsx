import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  if (!form.name || !form.lastname || !form.email || !form.password || !form.confirmPassword) {
    alert('Please fill in all fields.');
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  alert('Account created successfully!');
  router.replace('/homepage');
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={require('./../assets/images/login.png')}
          />

          <Text style={styles.title}>
            Krijoje <Text style={{ color: '#075eec' }}> llogarinë</Text> tuaj
          </Text>

          <Text style={styles.subtitle}>Bashkohu me Piqe-Hiqe dhe fillo të mësosh më zgjuarsi</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputRow}>
            <View style={[styles.input, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Emri</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                placeholder="Filan"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.name}
                onChangeText={(name) => setForm({ ...form, name })}
              />
            </View>

            <View style={[styles.input, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Mbiemri</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                placeholder="Fisteku"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.lastname}
                onChangeText={(lastname) => setForm({ ...form, lastname })}
              />
            </View>
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email adresa</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="filan@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Fjalëkalimi</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Konfirmo Fjalëkalimin</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.confirmPassword}
              onChangeText={(confirmPassword) => setForm({ ...form, confirmPassword })}
            />
          </View>

          <TouchableOpacity onPress={handleSignUp}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Regjistrohu</Text>
              </View>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => {
              router.push('/');
            }}>
            <Text style={styles.formLink}>Keni tashmë një llogari? <Text style={{ textDecorationLine: 'underline', color: '#075eec' }}>Identifikohu</Text>
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
    flexShrink: 1,
    flexBasis: 0,
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
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000ff',
    textAlign: 'center',
  },
});
