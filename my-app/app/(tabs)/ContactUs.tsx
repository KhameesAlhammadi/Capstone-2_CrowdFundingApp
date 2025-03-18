import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = () => {
    if (!name || !email || !subject || !message) {
      setStatus("All fields are required.");
      return;
    }
    setStatus("Message sent successfully!");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <ScrollView>
    <View style={styles.container}>
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
        <Text style={styles.contact}><Text style={styles.bold}>Email:</Text> contact@wefundeachother.com</Text>
        <Text style={styles.contact}><Text style={styles.bold}>Phone:</Text> +971 512345678</Text>
        <Text style={styles.contact}><Text style={styles.bold}>Address:</Text> Abu Dhabi, Higher Colleges Of Technology</Text>

        {/* Contact Form */}
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Subject" value={subject} onChangeText={setSubject} />
        <TextInput style={styles.textArea} placeholder="Message" value={message} onChangeText={setMessage} multiline numberOfLines={4} />

        {/* Send Button */} 
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send Message</Text> 
        </TouchableOpacity>
        {/* TouchableOpacity is a button in React Native that you can style however you want. 
       When you tap it, it fades a little, showing that it's been pressed. */}
      </View>
       
      
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* General Page Styles */
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa", justifyContent: "center" },

  /* Header Styles */
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", padding: 15, backgroundColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5 },
  logo: { fontSize: 22, fontWeight: "bold", color: "#333" },
  menuButton: { padding: 10 },
  menuIcon: { fontSize: 24, fontWeight: "bold", color: "#333" },

  /* Contact Box Styles */
  contactBox: { backgroundColor: "#fff", padding: 20, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, width: "90%", marginTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#007bff", textAlign: "center", marginBottom: 10 },
  info: { textAlign: "center", marginBottom: 10 },
  contact: { textAlign: "center", marginBottom: 5 },
  bold: { fontWeight: "bold" },

  /* Form Input Styles */
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, marginBottom: 10 },
  textArea: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, height: 100, textAlignVertical: "top" },

  /* Button Styles */
  button: { backgroundColor: "#000", padding: 12, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  /* Footer Styles */
  footer: { marginTop: 20, backgroundColor: "#000", width: "100%", padding: 15, alignItems: "center" },
  footerText: { color: "white", fontSize: 14 },
});
