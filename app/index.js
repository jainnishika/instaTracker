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

export default function Login() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!data.email || !data.password) {
      alert("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/login`, data);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful 🎉");

      router.replace("/dashboard");
    } catch (err) {
      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
          "Login Failed. Please check your credentials.",
      );
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>InstaTrack</Text>
          <Text style={styles.subtitle}>Login</Text>
        </View>

        {/* Email */}
        <Text style={styles.label}>Email</Text>

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={data.email}
          onChangeText={(t) => setData({ ...data, email: t })}
          style={styles.input}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>

        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#888"
          secureTextEntry
          autoCapitalize="none"
          value={data.password}
          onChangeText={(t) => setData({ ...data, password: t })}
          style={styles.input}
        />

        {/* Login Button */}
        <TouchableOpacity
          onPress={login}
          disabled={loading}
          activeOpacity={0.8}
          style={[styles.loginButton, loading && styles.disabledButton]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Signup */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}> Create Account</Text>
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

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
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

  loginButton: {
    backgroundColor: "#E1306C",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333333",
  },

  orText: {
    color: "#777777",
    fontSize: 12,
    marginHorizontal: 12,
    fontWeight: "600",
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  signupText: {
    color: "#9A9A9A",
    fontSize: 14,
  },

  signupLink: {
    color: "#E1306C",
    fontSize: 14,
    fontWeight: "700",
  },
});
