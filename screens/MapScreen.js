// ../screens/MapScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput, Modal, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [pin, setPin] = useState(null);
  const [pinMode, setPinMode] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [allPins, setAllPins] = useState([]);
  const [descModalVisible, setDescModalVisible] = useState(false);
  const [pendingPin, setPendingPin] = useState(null);
  const [description, setDescription] = useState("");
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Get user info from AsyncStorage (as string)
      const user = await AsyncStorage.getItem("user");
      setUserInfo(user); // user is a string (username)
      console.log("userInfo from AsyncStorage:", user);

      // Fetch all pins from Firestore
      try {
        const querySnapshot = await getDocs(collection(db, "pins"));
        const pins = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.latitude && data.longitude) {
            pins.push({
              id: doc.id,
              latitude: data.latitude,
              longitude: data.longitude,
              userId: data.userId,
              description: data.description, // <-- make sure to include this!
              createdAt: data.createdAt,
            });
          }
        });
        setAllPins(pins);
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    })();
  }, []);

  const goToMyLocation = () => {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const handlePinButton = () => {
    console.log("userInfo at pin button:", userInfo);
    if (userInfo) {
      setPinMode(true);
      Alert.alert("Pin Mode", "Long press on the map to pin a location.");
    } else {
      Alert.alert(
        "Sign in required",
        "You need to sign in to pin a location.",
        [
          { text: "No thanks!", style: "cancel" },
          {
            text: "Sign in",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]
      );
    }
  };

  const handleLongPress = (e) => {
    if (pinMode && userInfo) {
      setPendingPin(e.nativeEvent.coordinate);
      setDescModalVisible(true);
    }
  };

  const handleSavePin = async () => {
    if (!description.trim()) {
      Alert.alert("Description required", "Please enter a description.");
      return;
    }
    try {
      await addDoc(collection(db, "pins"), {
        latitude: pendingPin.latitude,
        longitude: pendingPin.longitude,
        userId: userInfo || "anonymous",
        description: description.trim(),
        createdAt: serverTimestamp(),
      });
      setDescModalVisible(false);
      setDescription("");
      setPinMode(false);
      setPendingPin(null);
      Alert.alert("Location pinned!", "Your location has been pinned successfully.");

      // Refresh pins after adding
      const querySnapshot = await getDocs(collection(db, "pins"));
      const pins = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.latitude && data.longitude) {
          pins.push({
            id: doc.id,
            latitude: data.latitude,
            longitude: data.longitude,
            userId: data.userId,
            description: data.description,
            createdAt: data.createdAt,
          });
        }
      });
      setAllPins(pins);
    } catch (error) {
      Alert.alert("Error", "There was an error pinning your location. Please try again.");
    }
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#EC6135" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onLongPress={handleLongPress}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here!"
        >
          <Icon name="location" size={36} color="#EC6135" />
        </Marker>
        {/* Show all pins from Firestore */}
        {allPins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            title={pin.description || "Pinned Location"}
            description={`Pinned by: ${pin.userId || "anonymous"}`}
            pinColor="blue"
          />
        ))}
        {pin && (
          <Marker
            coordinate={pin}
            title="Pinned Location"
            pinColor="blue"
          />
        )}
      </MapView>
      {/* Pin Location Button */}
      <TouchableOpacity
        style={[styles.circleButton, { bottom: 90, backgroundColor: "#49A5A2" }]}
        onPress={handlePinButton}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
      {/* Go to My Location Button */}
      <TouchableOpacity style={styles.circleButton} onPress={goToMyLocation}>
        <Icon name="locate" size={28} color="#fff" />
      </TouchableOpacity>
      {/* Pin Description Modal */}
      <Modal
        visible={descModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDescModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            width: '80%'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Pin Description</Text>
            <TextInput
              placeholder="Enter a brief description"
              value={description}
              onChangeText={setDescription}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 10,
                marginBottom: 15
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button title="Cancel" onPress={() => { setDescModalVisible(false); setDescription(""); setPendingPin(null); }} />
              <View style={{ width: 10 }} />
              <Button title="Save" onPress={handleSavePin} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  circleButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#EC6135',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});
