import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Image, ActivityIndicator } from "react-native";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header/Headers";

export default function HomeScreen() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(getFirestore(), "properties"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProperties(data);
      setLoading(false);
    });

    return () => {
      setProperties([]);
      unsubscribe();
    };
  }, []);

  const testimonialsData = [
    { id: "1", text: "This platform made real estate investing simple!", user: "Hussein" },
    { id: "2", text: "Highly recommend! Easy investment process.", user: "Mohamed" },
    { id: "3", text: "A seamless experience! Great support.", user: "Humaid" },
    { id: "4", text: "WeFundEachOther helped me invest without huge upfront costs!", user: "Souad" },
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
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header />
      <ScrollView>
        <View style={{ padding: 20, backgroundColor: "#fff", elevation: 3 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333", textAlign: "center" }}>WeFundEachOther</Text>
        </View>

        <View style={{ padding: 30, backgroundColor: "#f5f5f5", alignItems: "center", borderRadius: 10, margin: 15 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#000", padding: 10, borderRadius: 5 }}
            onPress={() => navigation.navigate("Properties")}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", padding: 15 }}>
          <View style={{ width: "90%", backgroundColor: "#fff", padding: 15, borderRadius: 10, elevation: 2 }}>
            <TextInput style={{ width: "90%", padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5, borderColor: "#ddd" }} placeholder="Search for available properties" />
            <TextInput style={{ width: "90%", padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5, borderColor: "#ddd" }} placeholder="Location" />
            <TextInput style={{ width: "90%", padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5, borderColor: "#ddd" }} placeholder="Property Type" />
            <TouchableOpacity style={{ backgroundColor: "#000", padding: 10, borderRadius: 5 }}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Search Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 15, textAlign: "center" }}>Popular Property Listings</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 10 }} />
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id?.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, alignItems: "center", justifyContent: "center", flexGrow: 1 }}
            renderItem={({ item }) => (
              <View style={{ width: 180, backgroundColor: "#fff", borderRadius: 10, padding: 10, marginHorizontal: 8, elevation: 3, alignItems: "center" }}>
                <Image source={{ uri: item?.imageUrl }} style={{ width: "100%", height: 130, borderRadius: 8, resizeMode: "cover" }} />
                <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 5 }}>{item?.title}</Text>
                <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>{item?.location}</Text>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "green", textAlign: "center" }}>{item?.price} AED</Text>
              </View>
            )}
          />
        )}

        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 15, textAlign: "center" }}>Our Key Features</Text>
        <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", paddingHorizontal: 10 }}>
          {[
            { title: "Easy Sign Up" },
            { title: "Real Estate Crowdfunding" },
            { title: "Secure and Reliable" },
          ].map((feature, index) => (
            <View key={index} style={{ width: "30%", padding: 15, backgroundColor: "#fff", borderRadius: 10, margin: 10, alignItems: "center", elevation: 3 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{feature.title}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 15, textAlign: "center" }}>What Our Users Say</Text>
        <FlatList
          ref={flatListRef}
          data={testimonialsData}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center", justifyContent: "center", paddingHorizontal: "5%" }}
          renderItem={({ item }) => (
            <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 20, marginHorizontal: "5%", elevation: 3, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#ddd" }}>
              <Text style={{ fontSize: 18, fontStyle: "italic", color: "#333", textAlign: "center", marginBottom: 10, lineHeight: 24 }}>{`“${item.text}”`}</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#555" }}>- {item.user}</Text>
            </View>
          )}
          getItemLayout={(data, index) => ({
            length: "90%",
            offset: "90%" * index,
            index,
          })}
        />
      </ScrollView>
    </View>
  );
}