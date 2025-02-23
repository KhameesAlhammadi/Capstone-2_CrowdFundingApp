import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthPage from "./index";
import ProfilePage from "./profilePage";

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={AuthPage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
    </Stack.Navigator>
  );
}
