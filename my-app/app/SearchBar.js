import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Picker } from "@react-native-picker/picker";

const GOOGLE_API_KEY = "YOUR_GOOGLE_PLACES_API_KEY"; // Replace with actual API Key
const { width } = Dimensions.get("window"); // Get screen width for responsiveness
const isMobile = width < 600; // Define mobile breakpoint

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [isMoreVisible, setIsMoreVisible] = useState(false); // Toggle More Filters

  const handleSearch = () => {
    onSearch({ location, propertyType, minPrice, maxPrice, beds });
  };

  return (
    <View style={styles.container}>
      {/* Row 1: Search Location */}
      <View style={styles.row}>
        <TextInput
          placeholder="Search Location..."
          value={location}
          onChangeText={setLocation}
          style={styles.fullWidth}
        />
      </View>

      {/* Row 2: Property Type & Prices */}
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={propertyType}
            onValueChange={(itemValue) => setPropertyType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Property Type" value="" />
            <Picker.Item label="Villa" value="Villa" />
            <Picker.Item label="Apartment" value="Apartment" />
            <Picker.Item label="Commercial" value="Commercial" />
          </Picker>
        </View>
        <TextInput
          placeholder="Min Price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* Row 3: Max Price & Beds */}
      <View style={styles.row}>
        <TextInput
          placeholder="Max Price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Beds"
          value={beds}
          onChangeText={setBeds}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* Row 4: More & Search Buttons */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, isMoreVisible && styles.buttonActive]}
          onPress={() => setIsMoreVisible(!isMoreVisible)}
        >
          <Text style={styles.buttonText}>{isMoreVisible ? "Less" : "More"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Expanded Filters Section */}
      {isMoreVisible && (
        <View style={styles.expandedFilters}>
          <TextInput placeholder="Area Size (sqft)" style={styles.fullWidth} />
          <Picker style={styles.picker}>
            <Picker.Item label="Furnished" value="" />
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
          </Picker>
          <Picker style={styles.picker}>
            <Picker.Item label="Amenities" value="" />
            <Picker.Item label="Gym" value="gym" />
            <Picker.Item label="Pool" value="pool" />
            <Picker.Item label="Parking" value="parking" />
          </Picker>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "1px solid black",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  fullWidth: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  inputWrapper: {
    width: "48%",
  },
  input: {
    width: "48%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    width: "100%",
    height: 45,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: "48%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#ddd",
  },
  buttonText: {
    fontWeight: "bold",
  },
  searchButton: {
    width: "48%",
    padding: 12,
    backgroundColor: "black",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  searchText: {
    color: "white",
    fontWeight: "bold",
  },
  expandedFilters: {
    flexDirection: "column",
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});

export default SearchBar;
 