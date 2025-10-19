import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import InputField from '../components/InputField';
export default function LoginScreen() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#eBecf4'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('./../assets/images/login.png')} 
          style={styles.headerImg}
          alt='Logo'
           />

        <Text style={styles.title}>Welcome to Piqe-Hiqe</Text>
        <Text style={styles.subtitle}>Learn smarter, not harder</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.quote}
            textAlign='left'>Log in to continue learning</Text>
            <Text style={styles.inputLabel}>Email address</Text>
            <InputField
              style={styles.inputControl}
              value={form.email}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
               />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <InputField
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={password => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password} />
          </View>
           <View style={styles.formAction}>
              <Button
              onPress={() => {
                // handle onPress
              }}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Log in</Text>
              </View>
            </Button>
          </View>
         
         <TouchableOpacity
            onPress={() => {
              // handle link
            }}>
            <Text style={styles.formLink}>Forgot password?</Text>
          </TouchableOpacity>


        
        </View>
        </View>
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
   padding: 24,
   flex: 1
  },
  header: {
    padding: 30,
    flex: 1,
    marginVertical: 36,
  },
  headerImg: {
    width: 0,
    height: 80,
    alignSelf: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',

  },
  input: {
    marginBottom: 16,
  },
  quote: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'left',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '500',
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
    form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
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
});
