import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you install expo icons: expo install @expo/vector-icons

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState(""); // 'success' or 'error'
  const translateY = useState(new Animated.Value(-100))[0]; // Starts above screen

  // Function to show notification with animation
  const showNotification = (message, type) => {
    setNotification(message);
    setNotificationType(type);

    // Slide down animation
    Animated.timing(translateY, {
      toValue: 20, // Moves the notification down
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Hide notification after 3 seconds
    setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100, // Moves it back up
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 3000);
  };

  const handleSend = () => {
    if (!name && !email && !subject && !message) {
      showNotification("All fields are empty. Please fill in the required details.", "error");
      return;
    }

    if (!name || !email || !subject || !message) {
      showNotification("Some fields are empty. Please complete the form.", "error");
      return;
    }

    showNotification("Your message has been sent successfully!", "success");

    // Clear input fields after submission
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <View style={styles.container}>
      {/* Notification System */}
      <Animated.View style={[styles.notification, { transform: [{ translateY }] }]}>
        <View style={[styles.notificationBox, notificationType === "success" ? styles.successBox : styles.errorBox]}>
          <Ionicons
            name={notificationType === "success" ? "checkmark-circle" : "alert-circle"}
            size={24}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      </Animated.View>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.logo}>WeFundEachOther</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info Section */}
      <View style={styles.contactBox}>
        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.info}>
          If you have any questions, feel free to send us a message using the form below,
          or contact us directly at:
        </Text>
        <Text style={styles.contact}>
          <Text style={styles.bold}>Email: </Text>contact@wefundeachother.com
        </Text>
        <Text style={styles.contact}>
          <Text style={styles.bold}>Phone: </Text>+971 512345678
        </Text>
        <Text style={styles.contact}>
          <Text style={styles.bold}>Address: </Text>Abu Dhabi, Higher Colleges Of Technology
        </Text>

        {/* Contact Form */}
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Subject" value={subject} onChangeText={setSubject} />
        <TextInput style={styles.textArea} placeholder="Message" value={message} onChangeText={setMessage} multiline numberOfLines={4} />

        {/* Send Button with Alert Notification */} 
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send Message</Text> 
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 WeFundEachOther. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* General Page Styles */
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa", // Light grey background
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  /* Header Styles */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  logo: { fontSize: 22, fontWeight: "bold", color: "#333" },
  menuButton: { padding: 10 },
  menuIcon: { fontSize: 24, fontWeight: "bold", color: "#333" },

  /* Contact Box Styles */
  contactBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxWidth: 800,
    marginTop: 40, // Moves form slightly down
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#007bff", textAlign: "center", marginBottom: 10 },
  info: { textAlign: "center", marginBottom: 10 },
  contact: { textAlign: "center", marginBottom: 5 },
  bold: { fontWeight: "bold" },

  /* Form Input Styles */
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, marginBottom: 10, width: "100%" },
  textArea: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, height: 100, textAlignVertical: "top", width: "100%" },

  /* Button Styles */
  button: { backgroundColor: "#000", padding: 12, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  /* Footer Styles */
  footer: { marginTop: 20, backgroundColor: "#000", width: "100%", padding: 15, alignItems: "center" },
  footerText: { color: "white", fontSize: 14 },

  /* Notification (Slide Down) */
  notification: { position: "absolute", top: 10, left: "10%", right: "10%", zIndex: 10 },
  notificationBox: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 8, elevation: 5 },
  successBox: { backgroundColor: "#28a745" }, /* Green for success */
  errorBox: { backgroundColor: "#dc3545" }, /* Red for error */
  icon: { marginRight: 10 },
  notificationText: { color: "white", fontSize: 14, fontWeight: "bold", textAlign: "center" },
});