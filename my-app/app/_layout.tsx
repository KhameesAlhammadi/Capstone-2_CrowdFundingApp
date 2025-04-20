import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthPage from "./index";
import InvestPage from "./invest";
import HomeScreen from "./home";
import ContactScreen from "./ContactUS";

const Stack = createNativeStackNavigator();

export default function MyStack() 
{
  return (
    <Stack.Navigator initialRouteName="Invest">
      <Stack.Screen name="SignIn" component={AuthPage}  options={{ headerShown: false }}/>
      <Stack.Screen name="Invest" component={InvestPage} options={{ headerShown: false }} />
      <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }}/> 
      <Stack.Screen name="Contact us" component={ContactScreen} options={{ headerShown: false }}/> 
    </Stack.Navigator>
  );
}