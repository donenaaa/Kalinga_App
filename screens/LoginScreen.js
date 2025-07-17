import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { loginWithUsernameAndPassword } from "../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation, onLogin }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      const success = await loginWithUsernameAndPassword(username, password);
      if (success) {
        await AsyncStorage.setItem("user", username.trim());
        if (onLogin) onLogin(); // Properly call the function if passed
        Alert.alert("Success", "Logged in!");
        navigation.replace("MainTabs", { username });
      } else {
        Alert.alert("Error", "Invalid username or password");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#225B64" }}>
      <Text style={styles.title}>SIGN IN</Text>

      <Image
        source={require("../assets/Kalinga_logo.png")} // Update the path as needed
        style={styles.loginImage}
        resizeMode="contain"
      />

      <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>
        Welcome to {"\n"}
        <Text style={styles.kalingaText}>KALINGA!</Text>
      </Animated.Text>

      <Animated.View
        style={[
          styles.formContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.inputWrapper}>
          <Icon
            name="person-outline"
            size={25}
            color="#225B64"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Enter Username"
            style={styles.input}
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon
            name="lock-closed-outline"
            size={25}
            color="#225B64"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Enter Password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.rememberForgotRow}>
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            >
              {rememberMe && <Icon name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Divider with "or" */}
        {/* <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View> */}

        {/* <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>
            Continue without logging in
          </Text>
        </TouchableOpacity> */}

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Not yet a member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signupLink}> SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    height: "100%",
    fontSize: 30,
    marginBottom: 10,
    textAlign: "center",
    color: "#EC6135",
    backgroundColor: "#fff",
    padding: 40,
    fontWeight: "bold",
  },
  loginImage: {
    position: "absolute",
    top: 95,
    width: 130,
    height: 130,
    alignSelf: "center",
  },
  welcomeText: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 240,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 25,
    color: "black",
    fontWeight: 400,
    opacity: 0.8,
  },
  kalingaText: {
    color: "#FCBE38",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 4,
  },
  formContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: "40%",
    flex: 0.5,
    backgroundColor: "#49A5A2",
    borderTopLeftRadius: 50,
    padding: 20,
    paddingTop: 40,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 10,
    marginLeft: 10,
    width: 25,
    height: 25,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: "#333",
    fontSize: 15,
  },
  rememberForgotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 5,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#225B64",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#225B64",
    borderColor: "#225B64",
  },
  rememberMeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  forgotPasswordText: {
    color: "#fff",
    textAlign: "right",
    fontWeight: "600",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#225B64",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 15,
    color: "#fff",
  },
  signupLink: {
    fontSize: 15,
    color: "#FCBE38",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
