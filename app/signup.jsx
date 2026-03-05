import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedButton from '../components/ui/AnimatedButton';
import { auth } from '../firebase/firebaseConfig';

export default function SignupScreen() {
  const [nameFocused, setNameFocused] = useState(false);
  const [lastnameFocused, setLastnameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const handleSignUp = async () => {
    // 1. Validimi bazik
    if (!form.name || !form.lastname || !form.email || !form.password || !form.confirmPassword) {
      alert('Ju lutem mbushini të gjitha fushat.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Ju lutem vendosni një email adresë valide.');
      return;
    }

    if (form.password.length < 6) {
      alert('Passwordi duhet të jetë së paku me 6 karaktere.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwordet nuk përputhen.');
      return;
    }

    try {
      // 2. Krijo user-in në Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      const user = userCredential.user;

      // 3. (Optional, por e bukur) – ruaj emrin si displayName
      await updateProfile(user, {
        displayName: `${form.name} ${form.lastname}`,
      });

      alert('Account created successfully!');

      // 4. Pas sign up – çoje te login (siç e ke pasur më herët)
      router.replace('/login');
    } catch (error) {
      console.log('SIGNUP ERROR:', error.code, error.message);

      if (error.code === 'auth/email-already-in-use') {
        alert('Kjo email është përdorur. Provo të logoheni.');
      } else {
        alert('Regjistrimi ka dështuar: ' + error.code);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffffff' }}>
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

          <Text style={styles.title}>
            Krijo <Text style={{ color: '#4bb8e7ff' }}> llogarinë tënde</Text>
          </Text>

          </View>

          <View style={styles.form}>

            <View style={styles.igInputContainer}>
              <Text
                style={[
                  styles.igLabel,
                  (nameFocused || form.name) && styles.igLabelActive,
                ]}
              >
                Emri
              </Text>

              <TextInput
                style={[styles.igInput, nameFocused && styles.igInputFocused]}
                value={form.name}
                onChangeText={(name) => setForm({ ...form, name })}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                autoCapitalize="words"
              />
            </View>


            <View style={styles.igInputContainer}>
              <Text
                style={[
                  styles.igLabel,
                  (lastnameFocused || form.lastname) && styles.igLabelActive,
                ]}
              >
                Mbiemri
              </Text>

              <TextInput
                style={[styles.igInput, lastnameFocused && styles.igInputFocused]}
                value={form.lastname}
                onChangeText={(lastname) => setForm({ ...form, lastname })}
                onFocus={() => setLastnameFocused(true)}
                onBlur={() => setLastnameFocused(false)}
                autoCapitalize="words"
              />
            </View>



            <View style={styles.igInputContainer}>
              <Text
                style={[
                  styles.igLabel,
                  (emailFocused || form.email) && styles.igLabelActive,
                ]}
              >
                Email
              </Text>
              <TextInput
                style={[styles.igInput, emailFocused && styles.igInputFocused]}
                value={form.email}
                onChangeText={(email) => setForm({ ...form, email })}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>


            <View style={styles.igInputContainer}>
              <Text
                style={[
                  styles.igLabel,
                  (passwordFocused || form.password) && styles.igLabelActive,
                ]}
              >
                Password
              </Text>

              <TextInput
                style={[styles.igInput, passwordFocused && styles.igInputFocused]}
                value={form.password}
                onChangeText={(password) => setForm({ ...form, password })}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry
              />
            </View>


            <View style={styles.igInputContainer}>
              <Text
                style={[
                  styles.igLabel,
                  (confirmPasswordFocused || form.confirmPassword) && styles.igLabelActive,
                ]}
              >
                Konfirmo Passwordin
              </Text>

              <TextInput
                style={[styles.igInput, confirmPasswordFocused && styles.igInputFocused]}
                value={form.confirmPassword}
                onChangeText={(confirmPassword) => setForm({ ...form, confirmPassword })}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                secureTextEntry
              />
            </View>


            <AnimatedButton
            title="Regjistrohu"
            onPress={handleSignUp}
            style={styles.btn}
            textStyle={styles.btnText}
          />

            <TouchableOpacity
              onPress={() => {
                router.push('/');
              }}
            >
              <Text style={styles.formLink}>Keni një llogari? Hyr</Text>
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
    color: '#01314eff',
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
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 20,
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
    backgroundColor: '#4bb8e7ff',
    borderColor: '#4bb8e7ff',
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
    color: '#001d4dff',
    textAlign: 'center',
    padding: '10',
  },
  igInputContainer: {
    position: 'relative',
    marginBottom: 12
  },
  igLabel: {
    position: 'absolute',
    left: 12, top: 15,
    fontSize: 16,
    color: '#8e8e8e',
    zIndex: 1
  },
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
    borderColor: '#8e8e8e'
  },
  igInputFocused: {
    backgroundColor: '#f4f6fa'
  },

});
