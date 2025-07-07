import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import LoginScreen from '../screens/LoginScreen';

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await addDoc(collection(db, 'users'), {
        firstName,
        lastName,
        username,
        email,
        phone,
        dob,
        gender,
        status,
        province,
        city,
        barangay,
        password, // In production, never store plain passwords!
      });
      Alert.alert('Success', 'Account created!');
      navigation.replace('LoginScreen'); // Navigate to LoginScreen
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      setDob(isoDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      {/* Date of Birth Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: dob ? '#000' : '#aaa' }}>
          {dob ? dob : 'Date of Birth'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dob ? new Date(dob) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      {/* Gender Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      {/* Status Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Status" value="" />
          <Picker.Item label="Single" value="Single" />
          <Picker.Item label="Married" value="Married" />
        </Picker>
      </View>

      <TextInput style={styles.input} placeholder="Province" value={province} onChangeText={setProvince} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="Barangay" value={barangay} onChangeText={setBarangay} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
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
