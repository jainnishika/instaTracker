import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const API = "http://localhost:8082";

export default function Signup() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const signup = async () => {
    if (!data.username || !data.email || !data.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/signup`, data);

      alert("Account Created Successfully 🎉");
      router.push("/");
    } catch (err) {
      console.log(err);
      alert("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  const isSmallScreen = width < 380;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.card,
          {
            width: width > 500 ? 420 : "100%",
            padding: isSmallScreen ? 20 : 28,
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>InstaTrack</Text>

          <Text style={styles.subtitle}>Signup</Text>
        </View>

        {/* Username */}
        <Text style={styles.label}>Username</Text>

        <TextInput
          placeholder="Enter your username"
          placeholderTextColor="#888"
          value={data.username}
          onChangeText={(t) => setData({ ...data, username: t })}
          style={styles.input}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={data.email}
          onChangeText={(t) => setData({ ...data, email: t })}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Create a password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={data.password}
            onChangeText={(t) => setData({ ...data, password: t })}
            style={styles.passwordInput}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={signup}
          disabled={loading}
          activeOpacity={0.8}
          style={[styles.signupButton, loading && styles.disabledButton]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>

          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#181818",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 25,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
  },

  label: {
    color: "#E5E5E5",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#242424",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 18,
  },

  signupButton: {
    backgroundColor: "#E1306C",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  signupText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#9A9A9A",
    fontSize: 14,
  },

  loginLink: {
    color: "#E1306C",
    fontSize: 14,
    fontWeight: "700",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 18,
  },

  passwordInput: {
    backgroundColor: "#242424",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 15,
  },

  eyeButton: {
    position: "absolute",
    right: 15,
    top: 14,
  },
});
