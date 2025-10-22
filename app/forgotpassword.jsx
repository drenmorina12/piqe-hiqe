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
export default function ForgotPasswordScreen() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const handleResetPassword = () => {
    if (!form.email || !form.password || !form.confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    alert('Password successfully reset!');
    router.replace('/login'); 
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
            Reset <Text style={{ color: '#075eec' }}>Password</Text>
          </Text>

          <Text style={styles.subtitle}>
            Enter your email and set a new password to continue.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>New password</Text>
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
            <Text style={styles.inputLabel}>Confirm new password</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.confirmPassword}
              onChangeText={(confirmPassword) =>
                setForm({ ...form, confirmPassword })
              }
            />
          </View>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleResetPassword}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Update Password</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push('/login');
            }}>
            <Text style={styles.formLink}>Back to Sign In</Text>
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
    marginTop: 10,
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
    color: '#075eec',
    textAlign: 'center',
  },
});