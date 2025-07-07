import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserInfo } from '../services/getinfo';

export default function HomeScreen({ route }) {
  const [userInfo, setUserInfo] = useState(null);

  // Assume username is passed via navigation params after login
  const username = route?.params?.username;

  useEffect(() => {
    const fetchUser = async () => {
      if (username) {
        const info = await getUserInfo(username);
        setUserInfo(info);
      }
    };
    fetchUser();
  }, [username]);

  // Fallbacks if userInfo is not loaded yet
  const barangay = userInfo?.barangay || '';
  const city = userInfo?.city || '';
  const province = userInfo?.province || '';
  const firstName = userInfo?.firstName || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#e75e33" // matches header background
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationRow}>
            <Icon name="location-outline" size={16} color="#fff" />
            <Text style={styles.locationText}>
              {barangay && city && province
                ? `${barangay}, ${city}, ${province}`
                : 'Loading...'}
            </Text>
          </View>
          <TouchableOpacity>
            <Icon name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <View style={styles.profilePlaceholder} />
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{firstName || '...'}</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchIcon}>
              <Icon name="search" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Services */}
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Image source={require('../assets/Kalinga_logo.png')} style={styles.cardImage} />
              <Text style={styles.cardText}>Food Distribution Schedules</Text>
            </View>
            <View style={styles.card}>
              <Image source={require('../assets/Kalinga_logo.png')} style={styles.cardImage} />
              <Text style={styles.cardText}>Medical Support Location</Text>
            </View>
            <View style={styles.card}>
              <View style={[styles.cardImage, styles.placeholder]} />
              <Text style={styles.cardText}>Evacuation Centers</Text>
            </View>
          </View>

          {/* Nearby Resources */}
          <Text style={styles.sectionTitle}>Nearby Resources</Text>
          <View style={styles.cardRow}>
            <View style={styles.blankCard} />
            <View style={styles.blankCard} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#e75e33',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { color: '#fff', marginLeft: 4, fontWeight: 'bold' },

  scrollContainer: 
  { padding: 16, 
    paddingBottom: 30 
  },

  welcomeContainer: 
  { flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10,
    marginBottom: 25, 
  },

  profilePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginRight: 12,
  },

  welcomeText: { fontSize: 16, color: '#333' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#000' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  searchIcon: {
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginLeft: 4,
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    paddingTop: 20,
  },

  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  card: {
    width: 115,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    elevation: 3,
  },
  cardImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 30,
    marginTop: 12,
    marginBottom: 7
  },
  cardText: { 
    fontSize: 13, 
    textAlign: 'center', 
   },
   
  placeholder: { backgroundColor: '#e1e1e1' },

  blankCard: {
    width: 170,
    height: 190,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
  },
});
