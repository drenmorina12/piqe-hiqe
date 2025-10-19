import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function InputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType }) {
  return (
    <View style={styles.input}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.control}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { marginBottom: 16 },
  label: { fontSize: 17, fontWeight: '600', color: '#222', marginBottom: 8 },
  control: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9D3DB',
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
  },
});
