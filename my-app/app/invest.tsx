import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import * as Progress from "react-native-progress";
import { ref, getDownloadURL } from "firebase/storage";
import { storage, auth, db } from "../firebaseconfig/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import Header from "./Header/Headers";

// Define route params
type RouteParams = {
  property: {
    id: string;
    city: string;
    imageUrl: string;
    description: string;
    location: string;
    type: number;
    rooms: number;
    price: number;
    property_name: string;
  };
};

export default function InvestPage() {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { property } = route.params;

  // Handle user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch image from Firebase Storage
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const imageRef = ref(storage, property.imageUrl);
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

  const handleDecrease = () => {
    setInvestmentAmount((prev) => Math.max(prev - 100, 0));
  };

  const handleIncrease = () => {
    setInvestmentAmount((prev) => prev + 100);
  };

  const handleInvest = async () => {
    if (!currentUser) {
      alert("You need to be signed in to make an investment.");
      return;
    }

    if (investmentAmount <= 0) {
      alert("Cannot invest with 0 AED.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "investors"), {
        userId: currentUser.uid,
        email: currentUser.email,
        investmentAmount,
        timestamp: new Date(),
        propertyId: property.id,
      });

      console.log("Investment saved with ID:", docRef.id);
      alert(`You have invested AED ${investmentAmount}`);
      // navigation.navigate("payment");
    } catch (e) {
      console.error("Error adding investment:", e);
      alert("There was an error processing your investment. Please try again.");
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
            <Text style={styles.propertyDetails}>
              {property.rooms} rooms • Ready • 🇦🇪 {property.location} • {property.type}
            </Text>
            <Text style={styles.propertyTitle}>{property.property_name}</Text>
            <Text style={styles.propertyPrice}>{property.price.toLocaleString()} AED</Text>

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
          <TouchableOpacity style={styles.adjustButton} onPress={handleDecrease}>
            <Text style={styles.adjustText}>-</Text>
          </TouchableOpacity>

          <View>
            <TextInput
              style={styles.amountText}
              value={investmentAmount.toString()}
              onChangeText={(text) => {
                let normalized = text.replace(/[^0-9]/g, "");
                if (normalized.startsWith("0") && normalized.length > 1) {
                  normalized = normalized.replace(/^0+/, "");
                }
                setInvestmentAmount(Number(normalized || "0"));
              }}
              keyboardType="numeric"
              placeholder="0"
            />
            <Text style={styles.TextCurr}>AED</Text>
          </View>

          <TouchableOpacity style={styles.adjustButton} onPress={handleIncrease}>
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
    paddingBottom: 120,
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
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  TextCurr: {
    textAlign: "center",
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
  stickyControlPanel: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 90,
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
