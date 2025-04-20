import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from "react-native";
import * as Progress from 'react-native-progress';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage, auth, db } from '../firebaseconfig/firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Header from "./header/header";

export default function InvestPage() {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigation = useNavigation();

  

  const route = useRoute();
 

  type RouteParams = {
	property: {
	  city: String;
	  imageUrl: string;
	  description: string;
	  location: string;
	  type: number;
	  rooms: number;
	  price: number;
	  property_name: string;
	};
  };
//   const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { property } = route.params;

  // handles user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user.email);
        setCurrentUser(user);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);



  // to fetch an image
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const imageRef = ref(storage, property.imageUrl); // Use dynamic path
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImageUrl();
  }, []);

  const increaseAmount = () => setInvestmentAmount(prev => prev + 100);
  const decreaseAmount = () => setInvestmentAmount(prev => (prev > 0 ? prev - 100 : 0));

  
  const handleInvest = async () => {
    if (currentUser) 
		{
			if (investmentAmount > 0)
				{
					try 
					{
						// Add a new document to the 'investors' collection
						const docRef = await addDoc(collection(db, "investors"), {
						userId: currentUser.uid, // Store the user's UID
						email: currentUser.email, // Store the user's email (optional)
						investmentAmount: investmentAmount, // Amount the user invested
						timestamp: new Date(), // Timestamp for when the investment was made
						});

						console.log("Investment saved with ID:", docRef.id);
						alert(`You have invested AED ${investmentAmount}`);
					} 
					
					catch (e) {
						console.error("Error adding investment: ", e);
						alert("There was an error processing your investment. Please try again.");
					}
				}
				else{
					alert("cannot invest with 0 AED");
				}
    } else {
      alert("You need to be signed in to make an investment.");
    }
  };

  

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.cardImage}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.cardImageInner} resizeMode="cover" />
          ) : (
            <ActivityIndicator size="large" color="#4caf50" />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.propertyDetails}>{property.rooms} rooms • Ready • 🇦🇪 {property.location} • {property.type}</Text>
            <Text style={styles.propertyTitle}>{property.property_name}</Text>
            <Text style={styles.propertyPrice}>{property.price} AED</Text>

            <View style={styles.progressContainer}>
              <Progress.Bar progress={0.45} width={null} color="#4caf50" borderRadius={4} />
              <Text style={styles.fundedText}>45% funded</Text>
            </View>

            <View style={styles.statsContainer}>
              <Text style={styles.bold}>Details:</Text>
			  <Text style={styles.stat}>{property.description}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={styles.stickyControlPanel}>
        <View style={styles.amountControl}>
            <TouchableOpacity style={styles.adjustButton} onPress={decreaseAmount}>
              <Text style={styles.adjustText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.amountText}>AED {investmentAmount}</Text>

            <TouchableOpacity style={styles.adjustButton} onPress={increaseAmount}>
              <Text style={styles.adjustText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.investInlineButton} onPress={handleInvest}>
              <Text style={styles.investInlineButtonText}>Invest Now</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    width: "50%",
    alignSelf: "center",
    paddingBottom: 120, // additional cushion
  },
  cardImage: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  cardImageInner: {
    width: "100%",
    height: "100%",
    aspectRatio: 16 / 9,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  propertyDetails: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  propertyPrice: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressContainer: {
    marginBottom: 10,
  },
  fundedText: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  statsContainer: {
    marginTop: 10,
  },
  stat: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  amountControl: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  adjustButton: {
    backgroundColor: "#ddd",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  adjustText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  investButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 14,
    width: 200,
    borderRadius: 10,
    alignItems: "center",
  },
  investButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  stickyControlPanel: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height:90,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    alignItems: "center",
  },
  investInlineButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 12,
  },
  investInlineButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: -100,
    zIndex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backButtonText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  
});
