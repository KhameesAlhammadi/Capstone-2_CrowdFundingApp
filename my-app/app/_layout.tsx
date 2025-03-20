import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthPage from "./index";
import ProfilePage from "./profilePage";
import HomeScreen from "./home";
import ContactScreen from "./ContactUS";

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName="ContactUS">
      <Stack.Screen name="SignIn" component={AuthPage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="home" component={HomeScreen} /> 
      <Stack.Screen name="ContactUS" component={ContactScreen} /> 
    </Stack.Navigator>
  );
}