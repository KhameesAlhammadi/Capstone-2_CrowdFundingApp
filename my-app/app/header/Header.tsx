import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("home")}>
        <Text style={styles.link}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Properties")}>
        <Text style={styles.link}>Properties</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ContactUS")}>
        <Text style={styles.link}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("index")}>
        <Text style={styles.link}>SignUp/in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  link: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },
});

export default Header;
