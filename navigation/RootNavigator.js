import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUp'; // ✅ Import your SignUp screen
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function LoginWrapper(props) {
    return <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginWrapper} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
