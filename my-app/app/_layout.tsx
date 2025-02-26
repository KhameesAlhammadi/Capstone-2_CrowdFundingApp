import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthPage from "./index";
import ProfilePage from "./profilePage";
import HomeScreen from "./home";

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="SignIn" component={AuthPage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="home" component={HomeScreen} /> 
    </Stack.Navigator>
  );
}