import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { firebaseApp } from "../firebase";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const db = getFirestore(firebaseApp);

export default function HomeScreen() {
  const [properties, setProperties] = useState<{ id: string; imageUrl: string; title: string; location: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  // Fetch properties from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "properties"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProperties(data);
      setLoading(false);
    });

    return () => {
      setProperties([]);
      unsubscribe();
    };
  }, []);

  // Testimonials Data
  const testimonialsData = [
    { id: "1", text: "This platform made real estate investing simple!", user: "User 1" },
    { id: "2", text: "Highly recommend! Easy investment process.", user: "User 2" },
    { id: "3", text: "A seamless experience! Great support.", user: "User 3" },
    { id: "4", text: "WeFundEachOther helped me invest without huge upfront costs!", user: "User 4" },
  ];
  
  
useEffect(() => {
  const interval = setInterval(() => {
    setScrollIndex((prevIndex) => {
      let nextIndex = prevIndex + 1;
      if (nextIndex >= testimonialsData.length) nextIndex = 0;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      return nextIndex;
    });
  }, 4000);

  return () => clearInterval(interval);
}, []);
  

  


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>WeFundEachOther</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/Login")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput style={styles.input} placeholder="Search for available properties" />
          <TextInput style={styles.input} placeholder="Location" />
          <TextInput style={styles.input} placeholder="Property Type" />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Search Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Listings */}
      <Text style={styles.sectionTitle}>Popular Property Listings</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 10 }} />
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id?.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.properties}
          renderItem={({ item }) => (
            <View style={styles.property}>
              <Image source={{ uri: item?.imageUrl }} style={styles.propertyImage} />
              <Text style={styles.propertyTitle}>{item?.title}</Text>
              <Text style={styles.propertyLocation}>{item?.location}</Text>
              <Text style={styles.propertyPrice}>{item?.price} AED</Text>
            </View>
          )}
        />
      )}

      {/* Key Features */}
      <Text style={styles.sectionTitle}>Our Key Features</Text>
      <View style={styles.featureContainer}>
        {[
          { title: "Easy Sign Up" },
          { title: "Real Estate Crowdfunding" },
          { title: "Secure and Reliable" },
        ].map((feature, index) => (
          <View key={index} style={styles.feature}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/Properties")}>
              <Text style={styles.buttonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>What Our Users Say</Text>
      <View>
        <FlatList
          ref={flatListRef}
          data={testimonialsData}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.testimonials}
          renderItem={({ item }) => (
            <View style={styles.testimonial}>
              <Text style={styles.testimonialText}>{`“${item.text}”`}</Text>
              <Text style={styles.testimonialUser}>- {item.user}</Text>
            </View>
          )}
          getItemLayout={(data, index) => ({
            length: width * 0.9,
            offset: width * 0.9 * index,
            index,
          })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { alignItems: "center", padding: 20, backgroundColor: "#fff", elevation: 3 },
  logo: { fontSize: 24, fontWeight: "bold", color: "#333" },
  hero: { padding: 30, backgroundColor: "#f5f5f5", alignItems: "center", borderRadius: 10, marginHorizontal: 15, marginTop: 15 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 15, textAlign: "center" },
  properties: { paddingHorizontal: 10, alignItems: "center", justifyContent: "center", flexGrow: 1 },
  property: { width: 180, backgroundColor: "#fff", borderRadius: 10, padding: 10, marginHorizontal: 8, elevation: 3, alignItems: "center" },
  propertyImage: { width: "100%", height: 130, borderRadius: 8, resizeMode: "cover" },
  propertyTitle: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 5 },
  propertyLocation: { fontSize: 14, color: "#666", textAlign: "center" },
  propertyPrice: { fontSize: 16, fontWeight: "bold", color: "green", textAlign: "center" },
  featureContainer: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", paddingHorizontal: 10 },
  feature: { width: width * 0.3, padding: 15, backgroundColor: "#fff", borderRadius: 10, margin: 10, alignItems: "center", elevation: 3 },
  button: { backgroundColor: "#000", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  testimonials: { alignItems: "center", justifyContent: "center", paddingHorizontal: width * 0.05 },
  testimonial: { width: width * 0.9, backgroundColor: "#fff", borderRadius: 12, padding: 20, marginHorizontal: width * 0.05, elevation: 3, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#ddd" },
  testimonialText: { fontSize: 18, fontStyle: "italic", color: "#333", textAlign: "center", marginBottom: 10, lineHeight: 24 },
  testimonialUser: { fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#555" },
  searchContainer: {
    alignItems: "center",
    padding: 15,
  },
  searchBar: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    width: "90%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    color: "#000000"
  },
  featureTitle: { 
    fontSize: 16, 
    fontWeight: "bold"
  },
});

function setScrollIndex(arg0: (prevIndex: any) => any) {
  throw new Error("Function not implemented.");
}

