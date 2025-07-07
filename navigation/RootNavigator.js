import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUp from '../screens/SignUp';
import TabNavigator from './TabNavigator';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function LoginWrapper(props) {
    return <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginWrapper} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}
