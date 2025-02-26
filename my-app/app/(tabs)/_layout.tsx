import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
      }}
    >

      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Main Page",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="Properties"
        options={{
          title: "Properties",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "information-circle" : "information-circle-outline"} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="PaymentMethods"
        options={{
          title: "Payments Page",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "card" : "card-outline"} color={color} size={24} />
          ),
        }}
      />
      {/* Hidden Login Tab */}
      <Tabs.Screen
        name="Login"
        options={{
          title: "Login Page",
          tabBarButton: () => null, // Hides tab from bottom navigation
          tabBarStyle: { display: "none" }, // Ensures no space is reserved for it
        }}
      />
    </Tabs>
  );
}
