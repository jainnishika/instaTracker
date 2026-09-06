import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./app/LoginScreen";
import SignupScreen from "./app/signup";
import DashboardScreen from "./app/dashboard";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown:false }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Signup" component={SignupScreen}/>
        <Stack.Screen name="Dashboard" component={DashboardScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}