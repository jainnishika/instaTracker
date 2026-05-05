import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
const API = "http://localhost:5000";

export default function Signup() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const signup = async () => {
    try {
      await axios.post(`${API}/signup`, data);
      alert("Account created!");
      router.push("/");
    } catch {
      alert("Signup failed");
    } 
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20, backgroundColor:"#111" }}>
      

      <TextInput placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={t => setData({...data, email:t})}
        style={{ backgroundColor:"#222", color:"#fff", padding:12, marginBottom:10 }}
      />

      <TextInput placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry={!showPassword
        }
        onChangeText={t => setData({...data, password:t})}
        style={{ backgroundColor:"#222", color:"#fff", padding:12, marginBottom:10 }}
      />
      <TouchableOpacity
      onPress={()=> setShowPassword(!showPassword)}
      style={{
        position: "abolute",
        right: 10,
        top: 12,
      }}
      >
        <Text style={{ color: "#E1306C", fontWeight: "bold"}}>
          {showPassword ? "Hide": "Show"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signup} style={{ backgroundColor:"#E1306C", padding:12 }}>
        <Text style={{ color:"#fff", textAlign:"center" }}>Signup</Text>
      </TouchableOpacity>
    </View>
  ); 

}