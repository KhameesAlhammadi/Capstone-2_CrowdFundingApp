import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, FlatList, Image, ActivityIndicator } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseconfig/firebase';
import Header from "./Header/Headers";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const testimonialsData = [
    { id: "1", text: "This platform made real estate investing simple!", user: "Hussein" },
    { id: "2", text: "Highly recommend! Easy investment process.", user: "Mohamed" },
    { id: "3", text: "A seamless experience! Great support.", user: "Humaid" },
    { id: "4", text: "WeFundEachOther helped me invest without huge upfront costs!", user: "Souad" },
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "properties"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProperties(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prev) => {
        const next = (prev + 1) % testimonialsData.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={styles.container}>

        {/* Hero */}
        <View style={styles.heroSimple}>
          <Text style={styles.heroTitle}>WeFundEachOther</Text>
          <Text style={styles.heroSubtitle}>Invest in properties with ease.</Text>
        <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate("Properties")}>
          <Text style={styles.heroButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>


        {/* Search Section */}
        <View style={styles.searchBox}>
          <TextInput style={styles.searchInput} placeholder="🔍 Search for properties" />
          <TextInput style={styles.searchInput} placeholder="📍 Location" />
          <TextInput style={styles.searchInput} placeholder="🏠 Property Type" />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        {/* Property Listings */}
        <Text style={styles.sectionTitle}>Popular Properties</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={properties}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.propertyList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card}>
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardLocation}>{item.location}</Text>
                  <Text style={styles.cardPrice}>{item.price.toLocaleString()} AED</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Features */}
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        <View style={styles.features}>
          {[
            { title: "📝 Easy Sign Up" },
            { title: "🏗️ Real Estate Crowdfunding" },
            { title: "🔐 Secure and Reliable" },
          ].map((item, i) => (
            <View key={i} style={styles.featureBox}>
              <Text style={styles.featureText}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <Text style={styles.sectionTitle}>What Our Users Say</Text>
        <FlatList
          ref={flatListRef}
          data={testimonialsData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.testimonialList}
          renderItem={({ item }) => (
            <View style={styles.testimonialCard}>
              <Text style={styles.testimonialText}>“{item.text}”</Text>
              <Text style={styles.testimonialUser}>- {item.user}</Text>
            </View>
          )}
          getItemLayout={(data, index) => ({
            length: width * 0.9,
            offset: width * 0.9 * index,
            index,
          })}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f9f9f9" },
  heroSection: { padding: 30, alignItems: "center", backgroundColor: "#fff" },
  heroTitle: { fontSize: 30, fontWeight: "bold", color: "#222" },
  heroSubtitle: { fontSize: 16, color: "#666", marginVertical: 10 },
  heroButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  heroButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  

  searchBox: { padding: 20 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  searchButton: { backgroundColor: "#000", padding: 12, borderRadius: 8 },
  searchButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },

  sectionTitle: { fontSize: 20, fontWeight: "600", marginVertical: 20, textAlign: "center" },

  propertyList: { paddingHorizontal: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 15,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  cardImage: { width: "100%", height: 140 },
  cardBody: { padding: 10 },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardLocation: { color: "#666", fontSize: 14 },
  cardPrice: { color: "green", fontWeight: "bold", fontSize: 16 },

  features: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 15, flexWrap: "wrap" },
  featureBox: { backgroundColor: "#fff", padding: 15, borderRadius: 10, margin: 8, width: "30%", alignItems: "center", elevation: 1 },
  featureText: { fontSize: 14, fontWeight: "500", textAlign: "center" },

  testimonialList: { paddingVertical: 20, paddingHorizontal: 10 },
  testimonialCard: {
    backgroundColor: "#fefefe",
    padding: 20,
    borderRadius: 12,
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    borderColor: "#eee",
    borderWidth: 1,
  },
  
  testimonialText: { fontStyle: "italic", fontSize: 16, marginBottom: 10, textAlign: "center", color: "#333" },
  testimonialUser: { fontWeight: "bold", textAlign: "center", color: "#000" },

  heroSimple: {
    backgroundColor: "#000",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  heroSubtitle: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
