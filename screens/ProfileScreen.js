import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo } from '../services/getinfo';

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const username = await AsyncStorage.getItem('user');
      console.log('Username from AsyncStorage:', username); // Debug
      if (username) {
        const info = await getUserInfo(username);
        console.log('Fetched user info:', info); // Debug
        setUserInfo(info);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#e75e33" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/Kalinga_logo.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {userInfo
            ? `${userInfo.firstName?.trim() || 'No Name'}`
            : 'No Name'}
        </Text>
        <Text style={styles.email}>
          {userInfo?.email || 'No Email'}
        </Text>
      </View>

      {/* Settings Options */}
      <View style={styles.settingsList}>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="person-outline" size={22} color="#555" />
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="lock-closed-outline" size={22} color="#555" />
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="notifications-outline" size={22} color="#555" />
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Icon name="settings-outline" size={22} color="#555" />
          <Text style={styles.settingText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="information-circle-outline" size={22} color="#555" />
          <Text style={styles.settingText}>About</Text>
        </TouchableOpacity>
      </View>

      {/* Log Out */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#e75e33" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },

  settingsList: {
    marginBottom: 40,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 'auto',
    backgroundColor: '#fff5f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#e75e33',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
