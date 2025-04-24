import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  const navItems = [
    { title: "Home", route: "home" },
    { title: "Properties", route: "Properties" },
    { title: "Portfolio", route: "Portfolio" },
    { title: "Contact Us", route: "ContactUS" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.route)}
            style={styles.linkWrapper}
          >
            <Text style={styles.linkText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  headerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    gap: 16,
  },
  linkWrapper: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },
});

export default Header;
