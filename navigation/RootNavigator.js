import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUp from "../screens/SignUp";
import TabNavigator from "./TabNavigator";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

function LoginWrapper(props) {
  const [_, setIsLoggedIn] = useState(false);
  return <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />;
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}
