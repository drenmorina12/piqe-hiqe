import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // NDRYSHO rrugën nëse firebase.js është diku tjetër

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      alert('Password reset email sent! Please check your inbox.');
      router.replace('/login'); // ose router.back() nëse do veç me u kthy
    } catch (error) {
      console.log('RESET ERROR:', error.code, error.message);

      if (error.code === 'auth/user-not-found') {
        alert('No user found with this email.');
      } else {
        alert('Failed to send reset email: ' + error.code);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header / Logo nëse don me përdor imazhin */}
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we will send you a link to reset your password.
          </Text>
        </View>

        {/* Forma */}
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={loading}
            >
              <View
                style={[
                  styles.btn,
                  loading ? { opacity: 0.7 } : null,
                ]}
              >
                <Text style={styles.btnText}>
                  {loading ? 'Sending...' : 'Send reset email'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.formLink}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputControl: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  formAction: {
    marginTop: 16,
    marginBottom: 12,
  },
  btn: {
    borderRadius: 9999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#075eec',
    borderWidth: 1,
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
    marginTop: 8,
  },
});
