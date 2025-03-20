import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import { Image } from "react-native";
const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false); // The login modal is hidden by default. 
  // The user can see the app first and open the login modal when needed. also If you set it to true, 
  // the login modal will show instantly when the app loads.
  const [email, setEmail] = useState(""); // Stores user email input
  const [password, setPassword] = useState(""); // Stores user password input
  const [selectedLocation, setSelectedLocation] = useState(""); // Stores selected location
  const [selectedPropertyType, setSelectedPropertyType] = useState(""); // Stores selected property type
  

  // used TouchableOpacity because it makes elements clickable like a fade effect when taped it can be used for text,icons , view

  const handleLogin = () => {
    console.log("Email:", email, "Password:", password); // Simulate login (Replace with API call if needed)
    setModalVisible(false); // Close modal after login
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>WeFundEachOther</Text>
        
        {/* Navigation Menu */}
        <View style={styles.nav}>
          <TouchableOpacity>
            <Text style={styles.navItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navItem}>Building</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navItem}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.navItem}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Welcome to WeFundEachOther</Text>
        <Text style={styles.heroSubtitle}>Connecting people to fund real estate investments together.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

    {/* Search Bar */}
    <View style={styles.searchBar}>
        {/* Search Input */}
        <TextInput 
            style={styles.input} 
            placeholder="Search for available properties" 
            placeholderTextColor="gray"
        />

        {/* Dropdowns Container (Row) */}
        <View style={styles.dropdownContainer}>
            {/* Location Dropdown */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedLocation}
                    onValueChange={(itemValue) => setSelectedLocation(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Location" value="" />
                    <Picker.Item label="Dubai" value="dubai" />
                    <Picker.Item label="Abu Dhabi" value="abu_dhabi" />
                    <Picker.Item label="Sharjah" value="sharjah" />
                    <Picker.Item label="Ajman" value="ajman" />
                </Picker>
            </View>

            {/* Property Type Dropdown */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedPropertyType}
                    onValueChange={(itemValue) => setSelectedPropertyType(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Property Type" value="" />
                    <Picker.Item label="Apartment" value="apartment" />
                    <Picker.Item label="Villa" value="villa" />
                    <Picker.Item label="Office" value="office" />
                    <Picker.Item label="Commercial Space" value="commercial" />
                </Picker>
            </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Search Now</Text>
        </TouchableOpacity>
    </View>



      {/* Property Listings */}
      <Text style={styles.sectionTitle}>Popular Property Listings</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.properties}>
        <View style={styles.property}>
          <Text style={styles.propertyTitle}>AED 800,000</Text>
          <Text style={styles.propertyDesc}>Luxury Apartment - 1,200 sqft</Text>
          <Text style={styles.propertyLocation}>Downtown Dubai</Text>
        </View>

        <View style={styles.property}>
          <Text style={styles.propertyTitle}>AED 1,500,000</Text>
          <Text style={styles.propertyDesc}>Beachfront Villa - 5,000 sqft</Text>
          <Text style={styles.propertyLocation}>Palm Jumeirah</Text>
        </View>

        <View style={styles.property}>
          <Text style={styles.propertyTitle}>AED 950,000</Text>
          <Text style={styles.propertyDesc}>Modern Townhouse - 2,500 sqft</Text>
          <Text style={styles.propertyLocation}>Jumeirah Village Circle</Text>
        </View>

        <View style={styles.property}>
          <Text style={styles.propertyTitle}>AED 2,000,000</Text>
          <Text style={styles.propertyDesc}>Penthouse - 3,800 sqft</Text>
          <Text style={styles.propertyLocation}>Burj Khalifa Area</Text>
        </View>

        <View style={styles.property}>
          <Text style={styles.propertyTitle}>AED 3,000,000</Text>
          <Text style={styles.propertyDesc}>Penthouse - 4.900 sqft</Text>
          <Text style={styles.propertyLocation}>Burj Khalifa Apartment</Text>
        </View>
      </ScrollView>

      {/* Key Features ()used .mao so that it can go thourgh loop instead of making it one by one */}
      <Text style={styles.sectionTitle}>Our Key Features</Text>
      <View style={styles.featureContainer}>
        {["Easy Sign Up   ", "Real Estate Crowdfunding", "Secure and Reliable"].map((feature, index) => (
          <View key={index} style={styles.feature}>
            <Text style={styles.featureTitle}>{feature}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Testimonials */}
      <Text style={styles.sectionTitle}>What Our Users Say</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonials}>
        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            "This platform made real estate investing so simple and accessible!"
          </Text>
          <Text style={styles.testimonialUser}>- User 1</Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            "I was able to invest in properties with minimal effort. Highly recommend!"
          </Text>
          <Text style={styles.testimonialUser}>- User 2</Text>
        </View>
        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            "I was able to invest in properties with minimal effort. Highly recommend!"
          </Text>
          <Text style={styles.testimonialUser}>- User 3</Text>
        </View>
        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            "I was able to invest in properties with minimal effort. Highly recommend!"
          </Text>
          <Text style={styles.testimonialUser}>- User 4</Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            "A seamless experience! Great support and easy investment process."
          </Text>
          <Text style={styles.testimonialUser}>- User 5</Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            "WeFundEachOther helped me diversify my portfolio without huge upfront costs!"
          </Text>
          <Text style={styles.testimonialUser}>- User 6</Text>
        </View>
      </ScrollView>

    

      {/* Login Modal (Improved) */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Login</Text>
            
            {/* User inputs email and password */}
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

            {/* Sign In Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModal}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
      /* General Page Styling */
      container: {
        height: height,  // 80% of the screen height
        width: width,    // 90% of the screen width
        alignSelf: "center",   // Center the container horizontally
        flex: 1,  // Takes up the full screen 
        backgroundColor: "light gray", // Light background color
        marginTop: 50,
      },

      /* Header (Top Bar) */
      header: { 
        flexDirection: "row",  // Aligns elements side by side
        justifyContent: "space-between", // Places logo on left, menu on right
        padding: 10, // Adds spacing
        backgroundColor: "#fff", // White background for the header
        elevation: 3 // Adds a subtle shadow for depth
      },
      /* Hero Section (Welcome Banner under the we fund logo) */
      hero: { 
        padding: 20, // Adds spacing inside
        backgroundColor: "#CAD6EF", // Light blue background
        alignItems: "flex-start", 
        paddingLeft: 40, 
        height: 350, // Increase the height
        justifyContent: "flex-end", // Moves content lower
        paddingBottom: 80, // Adjust to move content into red area
      },
      
      heroTitle: { 
        fontSize: 24, // Large text for title
        fontWeight: "bold" // Makes title bold
      },

      heroSubtitle: { 
        fontSize: 16, // Slightly smaller than the title
        marginVertical: 10, // Adds spacing above and below
        textAlign: "center" // Centers text
      },

      dropdownContainer: {
        flexDirection: "row",  
        justifyContent: "space-between",
        width: "35%",  // Reduce width to shrink elements
        alignSelf: "center",
        marginVertical: 5,  // Reduce spacing
    },
    
        pickerContainer: { 
          flex: 1,
          borderWidth: 1,
          borderColor: "lightgray",
          borderRadius: 6,
          height: 35,  // Reduce height
          justifyContent: "center",
          overflow: "hidden",
          marginHorizontal: 4,  // Reduce spacing between items
      },
      
      picker: {
          height: 35,  // Reduce height
          fontSize: 12,  // Make text smaller
          backgroundColor: "white",
          color: "black",
      },
      
      
        searchBar: { 
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,  // Reduce padding
            backgroundColor: "whitesmoke",
            width: "70%",  // Slightly reduce width
            alignSelf: "center",
            borderRadius: 3,  // Slightly smaller radius
            shadowColor: "black",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2, // Lighter shadow
            fontSize:10,
            marginTop: 20
        },
        
        input: { 
          width: "20%",
          flex: 2,
          height: 35,  // Reduce height
          paddingHorizontal: 8,  // Reduce padding
          fontSize: 12,  // Make text smaller
          borderWidth: 1,
          borderColor: "lightgray",
          borderRadius: 6,
          backgroundColor: "white",
          marginHorizontal: 8, 
           
      },
        
      button: { 
        backgroundColor: "blue",
        paddingVertical: 8,  // Adjust height
        paddingHorizontal: 12,  // Adjust width
        borderRadius: 6,
        alignItems: "center",
    },

    buttonText: {
        fontSize: 12,  // Make text smaller
        color: "white",
        fontWeight: "bold",
    },
  
      /* Logo Styling */
      logo: { 
        fontSize: 20, // Text size
        fontWeight: "bold", // Makes text bold
        color: "#333", // Dark gray color
      },

      /* Login Button in Header */
      loginButton: { 
        color: "#007bff", // Blue text color
        fontWeight: "bold" // Makes text bold
      },

      /* Section Titles (e.g. "Popular Properties", "Testimonials") */
      sectionTitle: { 
        fontSize: 22, // Bigger text size
        fontWeight: "bold", // Bold text
        marginVertical: 20, // Space above and below title
        textAlign: "center" // Centers the title
      },

      /* Property Listings Section */
      properties: { 
        padding: 10 // Adds padding around the listings
      },

      property: { 
        width: 250, // Box width for each property
        padding: 15, // Space inside each box
        marginRight: 10, // Space between property cards
        backgroundColor: "#fff", // White background for contrast
        borderRadius: 10, // Rounded edges for a modern look
        elevation: 3 // Shadow effect to lift the box
      },

      propertyTitle: { 
        fontSize: 18, // Medium-large text size
        fontWeight: "bold", // Bold text
        color: "#007bff" // Blue color to highlight price
      },

      propertyDesc: { 
        fontSize: 14, // Smaller than title
        color: "#555" // Dark gray for readability
      },

      propertyLocation: { 
        fontSize: 14, // Same size as description
        color: "#777" // Slightly lighter gray
      },

      /* Feature Section */
      featureContainer: { 
        flexDirection: "row", // Aligns features in a row
        justifyContent: "center", // Centers items in the row
        flexWrap: "wrap", // Allows items to move to the next line if needed
        paddingHorizontal: 10 // Adds spacing between items
      },

      feature: { 
        width: 150, // Box width for each feature
        padding: 20, // Adds space inside the box
        backgroundColor: "#f8f9fa", // Light gray background
        borderRadius: 10, // Rounded corners
        margin: 5, // Space between feature boxes
        alignItems: "center" // Centers text inside
      },

      featureTitle: { 
        fontSize: 16, // Medium size text
        fontWeight: "bold", // Bold text for emphasis
        marginBottom: 20
      },

      /* Testimonials Section */
      testimonials: { 
        padding: 10 // Adds padding around testimonials
      },

      testimonial: { 
        width: 250, // Box width for each testimonial
        padding: 15, // Adds space inside the box
        marginRight: 10, // Space between testimonial cards
        backgroundColor: "#fff", // White background for contrast
        borderRadius: 10, // Rounded edges for modern look
        elevation: 3 // Shadow effect
      },

      testimonialText: { 
        fontSize: 14, // Smaller text for quotes
        fontStyle: "italic" // Italic for styling
      },

      testimonialUser: { 
        fontSize: 14, // Same size as quote text
        fontWeight: "bold", // Makes user name bold
        textAlign: "right" // Aligns username to the right
      },

      /* Footer */
      footer: { 
        padding: 20, // Space inside footer
        backgroundColor: "#000", // Black background
        alignItems: "center" // Centers text
      },

      footerText: { 
        color: "#fff", // White text for contrast
        fontSize: 14 // Smaller text size
      },

      /* Login Modal */
      modalContainer: { 
        flex: 1, // Takes up full screen
        justifyContent: "center", // Centers modal in screen
        alignItems: "center", // Aligns everything inside the modal
        backgroundColor: "rgba(0,0,0,0.5)" // Dark transparent background
      },

      modalContent: { 
        backgroundColor: "#fff", // White modal background
        padding: 20, // Space inside modal
        borderRadius: 10, // Rounded edges
        width: 300, // Fixed width for modal box
        alignItems: "center" // Centers text inside
      },

      modalTitle: { 
        fontSize: 20, // Slightly larger title text
        fontWeight: "bold", // Bold for emphasis
        marginBottom: 15 // Space below title
      },

      closeModal: { 
        color: "red", // Red text for "Close" button
        marginTop: 10 // Space above
      }

  
      /* Navigation */
    ,nav: { 
      flexDirection: "row", 
      gap: 15, 
      alignItems: "center" 
    },

    navItem: { 
      fontSize: 10, 
      color: "#333", 
      fontWeight: "bold" 
    },

  //logo: { fontSize: 20, fontWeight: "bold", color: "#333" },
  
});
