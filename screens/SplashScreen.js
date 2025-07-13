// screens/SplashScreen.js
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";

export default function SplashScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Caveat: require("../assets/fonts/Caveat-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    const checkLogin = async () => {
      const username = await AsyncStorage.getItem("user");
      console.log("Username from AsyncStorage:", username);

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs", params: { username } }],
        });
      }, 2000);
    };

    if (fontsLoaded) {
      checkLogin();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // or show loading indicator

  return (
    <View style={styles.container}>
      <Text style={styles.text}>KALINGA</Text>
      <Image
        source={require("../assets/Kalinga_logo.png")}
        style={styles.logo}
      />
      <Text style={styles.subtitle}>
        Katalyst Application with Localized INteractive{"\n"}
        Guided-relief mAp
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 15,
  },
  text: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 4,
    color: "#EC6135",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Caveat",
    textAlign: "center",
    marginTop: 3,
    color: "#225B64",
    lineHeight: 30,
  },
});
