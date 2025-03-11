import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Text, StyleSheet } from "react-native";
import SearchBar from "../SearchBar";
import { fetchProperties } from "../services/propertyService"; // Mock data

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    const getProperties = async () => {
      const data = await fetchProperties();
      setProperties(data);
      setFilteredProperties(data);
    };
    getProperties();
  }, []);

  // Function to filter properties based on search inputs
  const handleSearch = ({ location, propertyType, minPrice, maxPrice, beds }) => {
  let filtered = properties;

  if (location) {
    filtered = filtered.filter((p) =>
      p.propertyLocation.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (propertyType) {
    filtered = filtered.filter((p) =>
      p.type.toLowerCase() === propertyType.toLowerCase()
    );
  }

  if (minPrice) {
    filtered = filtered.filter((p) => parseFloat(p.price.replace(/,/g, "")) >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => parseFloat(p.price.replace(/,/g, "")) <= parseFloat(maxPrice));
  }

  if (beds) {
    filtered = filtered.filter((p) => p.beds && p.beds >= parseInt(beds));
  }

  setFilteredProperties(filtered);
};

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.price}>AED {item.price}</Text>
      <Text style={styles.details}>{item.type} - {item.propertyLocation}</Text>
      <Text style={styles.description}>{item.propertyDescription}</Text>
      <View style={styles.funding}>
        <Text>Remaining: AED {item.remainingAmount}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />

      {filteredProperties.length === 0 ? (
        <Text style={styles.noResultsText}>No properties found.</Text>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.propertyId}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  noResultsText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "red" },
  card: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  image: { width: "100%", height: 200, borderRadius: 8 },
  price: { fontSize: 18, fontWeight: "bold", marginTop: 5 },
  details: { color: "gray" },
  description: { marginTop: 5, color: "#666" },
  funding: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
});

export default PropertyList;
