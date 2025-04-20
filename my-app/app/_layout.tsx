import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthPage from "./index";
import InvestPage from "./invest";
import HomeScreen from "./home";
import ContactScreen from "./ContactUS";
import PropertiesScreen from "./(tabs)/Properties";
import PaymentScreen from "./payment";

const Stack = createNativeStackNavigator();

export default function MyStack() 
{
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="index" component={AuthPage}  options={{ headerShown: false }}/>
      <Stack.Screen name="invest" component={InvestPage} options={{ headerShown: false }} />
      <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }}/> 
      <Stack.Screen name="ContactUS" component={ContactScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Properties" component={PropertiesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="payment" component={PaymentScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}