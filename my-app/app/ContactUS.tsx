import React, { useState } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Linking, Animated, useWindowDimensions, ActivityIndicator
} from "react-native";
import Header from "./Header/Headers";
import emailjs from '@emailjs/browser';
import { Ionicons } from "@expo/vector-icons";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [isSending, setIsSending] = useState(false);
  const translateY = useState(new Animated.Value(-100))[0];
  const { width } = useWindowDimensions();

  const showNotification = (message, type) => {
    setNotification(message);
    setNotificationType(type);
    Animated.timing(translateY, {
      toValue: 20,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 3000);
  };

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateEmail = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=0270f2dd5d5b433ab3e72573377b716a&email=${email}`
      );
      const data = await response.json();
      return data.deliverability === "DELIVERABLE" && !data.is_disposable_email?.value;
    } catch (error) {
      console.error("Email validation failed:", error);
      return true; // fallback: allow to proceed if validation fails
    }
  };

  const isValidName = (name: string): boolean => {
    const onlyLetters = /^[A-Za-z\s]+$/.test(name);
    const lettersOnly = name.replace(/\s/g, "");
    return onlyLetters && lettersOnly.length >= 3;
  };

  const handleSend = async () => {
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields.", "error");
      return;
    }

    if (!isValidName(name)) {
      showNotification("Name must be at least three letters.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Invalid email format.", "error");
      return;
    }

    setIsSending(true);
    const isReal = await validateEmail(email);
    if (!isReal) {
      setIsSending(false);
      showNotification("This email doesn't appear to be real.", "error");
      return;
    }

    try {
      await emailjs.send('service_iyf04ik', 'template_12bhrrx', {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        email: email,
      }, 'AZjPZeCE6ytUzGEFc');

      await emailjs.send('service_iyf04ik', 'template_nqk9q7f', {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
      }, 'AZjPZeCE6ytUzGEFc');

      showNotification("Your message has been sent successfully!", "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Failed to send email:", err);
      showNotification("Failed to send your message. Please try again later.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <Header />

      {notification !== "" && (
        <Animated.View
          style={[
            styles.notification,
            {
              transform: [{ translateY }],
              width: width * 0.9,
              left: (width - width * 0.9) / 2,
            },
          ]}
        >
          <View style={[styles.notificationBox, notificationType === "success" ? styles.successBox : styles.errorBox]}>
            <Ionicons name={notificationType === "success" ? "checkmark-circle" : "alert-circle"} size={24} color="white" style={styles.icon} />
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        </Animated.View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: 50,
        }}
      >
        <View
          style={[
            styles.contactBox,
            {
              maxWidth: 600,
              alignSelf: "center",
              width: width > 640 ? "70%" : "100%",
            },
          ]}
        >
          <Text style={styles.title}>Get in Touch</Text>
          <Text style={styles.info}>
            If you have any questions, feel free to send us a message using the form below, or contact us directly at:
          </Text>
          <Text style={styles.contact}><Text style={styles.bold}>Email: </Text>WeFundEachOtherTeam@gmail.com</Text>
          <Text style={styles.contact}><Text style={styles.bold}>Phone: </Text>+971 512345678</Text>
          <Text style={styles.contact}><Text style={styles.bold}>Address: </Text>Abu Dhabi, Higher Colleges Of Technology</Text>

          <TextInput style={[styles.input, { width: "100%" }]} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={[styles.input, { width: "100%" }]} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInput style={[styles.input, { width: "100%" }]} placeholder="Subject" value={subject} onChangeText={setSubject} />
          <TextInput style={[styles.textArea, { width: "100%" }]} placeholder="Message" value={message} onChangeText={setMessage} multiline numberOfLines={4} />

          <TouchableOpacity style={styles.button} onPress={handleSend} disabled={isSending}>
            {isSending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 WeFundEachOther. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  notification: { position: "absolute", top: 0, left: 0, right: 0, alignSelf: "center", zIndex: 10 },
  notificationBox: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 8, elevation: 5 },
  icon: { marginRight: 10 },
  notificationText: { color: "white", fontSize: 14, fontWeight: "bold", textAlign: "center" },
  successBox: { backgroundColor: "#28a745" },
  errorBox: { backgroundColor: "#dc3545" },

  contactBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
    width: "100%",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#007bff", textAlign: "center", marginBottom: 10 },
  info: { textAlign: "center", marginBottom: 10, fontSize: 14 },
  contact: { textAlign: "center", marginBottom: 5, fontSize: 14 },
  bold: { fontWeight: "bold" },

  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, marginBottom: 10 },
  textArea: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, height: 100, textAlignVertical: "top" },

  button: { backgroundColor: "#000", padding: 12, borderRadius: 5, alignItems: "center", marginTop: 20 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  footer: { backgroundColor: "#000", padding: 15, alignItems: "center", },
  footerText: { color: "white", fontSize: 14 },
});
