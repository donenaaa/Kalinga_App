import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import ChatBox from '../screens/ChatScreen'; 
import ContactScreen from '../screens/ContactScreen';
import ChatScreen from '../screens/ChatScreen';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // 👈 Hides the top bar
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chatbox' : 'chatbox-outline';
              break;
            case 'Contacts':
              iconName = focused ? 'call' : 'call-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#49A5A2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Contacts" component={ContactScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
