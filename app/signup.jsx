import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedButton from '../components/ui/AnimatedButton';
import { auth } from "../firebase/firebaseConfig";

export default function SignupScreen() {
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
  if (
    !form.name ||
    !form.lastname ||
    !form.email ||
    !form.password ||
    !form.confirmPassword
  ) {
    alert("Ju lutem mbushini të gjitha fushat.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    alert("Ju lutem vendosni një email adresë valide.");
    return;
  }

  if (form.password.length < 6) {
    alert("Passwordi duhet të jetë së paku me 6 karaktere.");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("Passwordet nuk përputhen.");
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

    alert("Account created successfully!");

    // 4. Pas sign up – çoje te login (siç e ke pasur më herët)
    router.replace("/login");
  } catch (error) {
    console.log("SIGNUP ERROR:", error.code, error.message);

    if (error.code === "auth/email-already-in-use") {
      alert("Kjo email është përdorur. Provo të logoheni.");
    } else {
      alert("Regjistrimi ka dështuar: " + error.code);
    }
  }
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
          Krijoni <Text style={{ color: '#075eec' }}> llogarinë tuaj</Text>
          </Text>

          <Text style={styles.subtitle}>Bashkohu me Piqe-Hiqe dhe fillo të mësosh më zgjuar</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputRow}>
            <View style={[styles.input, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Emri</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                placeholder="John"
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
                placeholder="Doe"
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
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
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
            <Text style={styles.inputLabel}>Konfirmo Passwordin</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.confirmPassword}
              onChangeText={(confirmPassword) => setForm({ ...form, confirmPassword })}
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
    color: '#075eec',
    textAlign: 'center',
  },
});
