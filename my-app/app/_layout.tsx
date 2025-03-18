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
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="SignIn" component={AuthPage} />
      <Stack.Screen name="Invest" component={InvestPage} />
      <Stack.Screen name="home" component={HomeScreen} /> 
      <Stack.Screen name="Contact us" component={ContactScreen} /> 
    </Stack.Navigator>
  );
}