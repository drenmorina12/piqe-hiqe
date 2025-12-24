import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithGitHub } from '../auth/githubAuth';
import AnimatedButton from '../components/ui/AnimatedButton';
import Button from '../components/ui/Button';
import { auth } from '../firebase/firebaseConfig';

export default function WelcomeScreen() {

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSignIn = async () => {
    // 1. Validimi i inputeve PARA login-it
    if (!form.email || !form.password) {
      alert('Ju lutem shënoni email-in dhe passwordin.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Ju lutem vendosni një email valide.');
      return;
    }

    try {
      // 2. Thirrja e Firebase, presim me `await`
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      const user = userCredential.user; // user është këtu

      // 3. Nëse arriti këtu, login ka sukses
      alert('U identifikuat me sukses!');
      router.replace('/'); // shko në Home / root
    } catch (error) {
      // 4. Kapim gabimin (p.sh. auth/invalid-credential)
      console.log('LOGIN ERROR:', error.code, error.message);
      alert('Identifikimi dështoi. Ju lutem kontrolloni kredencialet dhe provoni përsëri.');
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

            <Text style={styles.title}>PIQE HIQE</Text>



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
              style={[
                styles.igInput,
                emailFocused && styles.igInputFocused,
              ]}
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
              style={[
                styles.igInput,
                passwordFocused && styles.igInputFocused,
              ]}
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => router.push('/forgotpassword')}>
            <Text style={styles.forgotText}>Keni harruar passwordin?</Text>
          </TouchableOpacity>

          <View style={styles.formAction}>
            <AnimatedButton
              title="Hyr"
              onPress={handleSignIn}
              style={styles.btn}
              textStyle={styles.btnText}
            />
          </View>
          <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>OSE</Text>
            <View style={styles.line} />
          </View>

          <View style={{ marginTop: 16 }}>
            <Button
              title="Kyçu me GitHub!"
              onPress={() => signInWithGitHub(router)}
              style={{ backgroundColor: '#24292e', marginBottom: 25 }}
              textStyle={{ color: '#fff' }}
            />
          </View>


       

        <TouchableOpacity
          onPress={() => {
            router.push('/signup');
          }}
        >
          <Text style={styles.formFooter}>
            Nuk keni llogari? <Text style={{ textDecorationLine: 'underline' }}>Regjistrohu</Text>
          </Text>
        </TouchableOpacity>
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
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    color: '#012c46ff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  headerImg: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginBottom: 20,
  },
  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 20,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    paddingVertical: 20,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 10,
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
    borderStyle: 'solid',
  },
  /** Button */
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
  }, igInputContainer: {
    position: 'relative',
    marginBottom: 12,
  },

  igLabel: {
    position: 'absolute',
    left: 12,
    top: 15,
    fontSize: 16,
    color: '#8e8e8e',
    zIndex: 1,
  },

  igLabelActive: {
    top: 6,
    fontSize: 11,
  },

  igInput: {
    height: 50,
    backgroundColor: '#ffffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 20,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#8e8e8e'
  },

  igInputFocused: {
    backgroundColor: '##f4f6fa',
  },
  forgotContainer: {
    paddingLeft: 8,     
  },

  forgotText: {
    fontSize: 14,
    color: '#000000ff',
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },

  separatorText: {
    marginHorizontal: 10,
    fontSize: 13,
    fontWeight: '600',   // pak më e trashë
    color: '#6b7280',
  },




});
