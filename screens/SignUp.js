import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function SignUp() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput style={styles.input} placeholder="First Name" />
      <TextInput style={styles.input} placeholder="Last Name" />
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" />
      <TextInput style={styles.input} placeholder="Gender" />
      <TextInput style={styles.input} placeholder="Status" />
      <TextInput style={styles.input} placeholder="Province" />
      <TextInput style={styles.input} placeholder="City" />
      <TextInput style={styles.input} placeholder="Barangay" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
