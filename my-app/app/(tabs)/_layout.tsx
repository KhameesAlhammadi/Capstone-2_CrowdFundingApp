// import { Tabs } from "expo-router";
// import Ionicons from "@expo/vector-icons/Ionicons";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: "#ffd33d",
//         tabBarStyle: {
//           height: 60,
//           paddingBottom: 5,
//           paddingTop: 5,
//           backgroundColor: "#fff",
//           borderTopWidth: 0,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="Properties"
//         options={{
//           title: "Properties",
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? "information-circle" : "information-circle-outline"} color={color} size={24} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="PaymentMethods"
//         options={{
//           title: "Payments Page",
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? "card" : "card-outline"} color={color} size={24} />
//           ),
//         }}
//       />

//       {/* Hiding Login Tab Properly */}
//       <Tabs.Screen
//         name="Login"
//         options={{
//           href: null, // Completely removes it from navigation
//           tabBarStyle: { display: "none" }, // Ensures no extra space is left
//           title: "Login Page", // Just for internal reference
//         }}
//       />
//     </Tabs>
//   );
// }
