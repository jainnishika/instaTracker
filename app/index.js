import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API = "http://localhost:5000";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });

      await AsyncStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20, backgroundColor:"#111" }}>
      <Text style={{ color:"#fff", fontSize:28, textAlign:"center", marginBottom:20 }}>
        InstaTracker 🔥
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
        style={{ backgroundColor:"#222", color:"#fff", padding:12, marginBottom:10 }}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        style={{ backgroundColor:"#222", color:"#fff", padding:12, marginBottom:10 }}
      />
      <TouchableOpacity onPress={login} style={{ backgroundColor:"#E1306C", padding:12 }}>
        <Text style={{ color:"#fff", textAlign:"center" }}>Login</Text>
      </TouchableOpacity>
      <Text
        onPress={() => router.push("/signup")}
        style={{ color:"#aaa", textAlign:"center", marginTop:15 }}
      >
        Don’t have account? Signup
      </Text>
    </View>
  );
}
