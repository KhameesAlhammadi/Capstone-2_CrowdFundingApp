import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from "react-native";
import * as Progress from 'react-native-progress';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseconfig/firebase'; 

export default function InvestPage() {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const imageRef = ref(storage, 'images/1740340619451'); 
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
  const handleInvest = () => alert(`You have invested AED ${investmentAmount}`);

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.cardImage}>
      {imageUrl ? (
            <Image source={{ uri: imageUrl }} 
            style={styles.cardImageInner}
            resizeMode= "cover"/>
            
            ) : (
            <ActivityIndicator  size="large" color="#4caf50" />
            
            )}
        </View>
        <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.propertyDetails}>🏠 2 • Ready • 🇦🇪 Dubai</Text>
          <Text style={styles.propertyTitle}>2 Bed in Studio One Tower</Text>
          <Text style={styles.propertyPrice}>AED 1,236,002</Text>
          <View style={styles.progressContainer}>
            <Progress.Bar progress={0.45} width={null} color="#4caf50" borderRadius={4} />
            <Text style={styles.fundedText}>45% funded</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>Annualised Return: <Text style={styles.bold}>11.98%</Text></Text>
            <Text style={styles.stat}>Annual Appreciation: <Text style={styles.bold}>6.84%</Text></Text>
            <Text style={styles.stat}>Gross Yield: <Text style={styles.bold}>6.77%</Text></Text>
            <Text style={styles.stat}>Net Yield: <Text style={styles.bold}>5.98%</Text></Text>
          </View>
        </View>
      </View>

      // Testing code
      <View style={styles.statsContainer}>
            <Text style={styles.stat}>Annualised Return: <Text style={styles.bold}>11.98%</Text></Text>
            <Text style={styles.stat}>Annual Appreciation: <Text style={styles.bold}>6.84%</Text></Text>
            <Text style={styles.stat}>Gross Yield: <Text style={styles.bold}>6.77%</Text></Text>
            <Text style={styles.stat}>Net Yield: <Text style={styles.bold}>5.98%</Text></Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>Annualised Return: <Text style={styles.bold}>11.98%</Text></Text>
            <Text style={styles.stat}>Annual Appreciation: <Text style={styles.bold}>6.84%</Text></Text>
            <Text style={styles.stat}>Gross Yield: <Text style={styles.bold}>6.77%</Text></Text>
            <Text style={styles.stat}>Net Yield: <Text style={styles.bold}>5.98%</Text></Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>Annualised Return: <Text style={styles.bold}>11.98%</Text></Text>
            <Text style={styles.stat}>Annual Appreciation: <Text style={styles.bold}>6.84%</Text></Text>
            <Text style={styles.stat}>Gross Yield: <Text style={styles.bold}>6.77%</Text></Text>
            <Text style={styles.stat}>Net Yield: <Text style={styles.bold}>5.98%</Text></Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>Annualised Return: <Text style={styles.bold}>11.98%</Text></Text>
            <Text style={styles.stat}>Annual Appreciation: <Text style={styles.bold}>6.84%</Text></Text>
            <Text style={styles.stat}>Gross Yield: <Text style={styles.bold}>6.77%</Text></Text>
            <Text style={styles.stat}>Net Yield: <Text style={styles.bold}>5.98%</Text></Text>
          </View>

          // End of Testing

    <View style={styles.investCardBorder}>
      <View style={styles.amountControl}>
        <TouchableOpacity style={styles.adjustButton} onPress={decreaseAmount}>
          <Text style={styles.adjustText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.amountText}>AED {investmentAmount}</Text>
        <TouchableOpacity style={styles.adjustButton} onPress={increaseAmount}>
          <Text style={styles.adjustText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.investButtonWrapper}>
        <TouchableOpacity style={styles.investButton} onPress={handleInvest}>
          <Text style={styles.investButtonText}>Invest Now</Text>
        </TouchableOpacity>
      </View>
    </View>
      
    </View>
    </ScrollView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
    width:"50%",
    alignSelf:"center",
  },
  investCardBorder:{
    paddingTop:5,
    backgroundColor: "#fff",
    width: "auto",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,            // for Android shadow
    overflow: "hidden",      // makes borderRadius clip child contents
    
    borderColor: "#ccc",     // <--- border color
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
  },
  cardImage: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,            // for Android shadow
    overflow: "hidden",      // makes borderRadius clip child contents
    borderWidth: 2,          // <--- border thickness
    borderColor: "#ccc",     // <--- border color
  },  
  cardImageInner: {
    width: "100%",            // image fully fills card
    height: "100%",
    aspectRatio: 16 / 9,
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
    width: 50,              // make width and height equal
    height: 50,
    borderRadius: 25,       // half of width/height for a perfect circle
    justifyContent: "center",
    alignItems: "center",   // centers icon/text inside the circle
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
  investButtonWrapper: {
    
    alignItems: 'center',
    marginBottom: 20,
  },
  investButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 14,
    width:200,
    borderRadius: 10,
    alignItems: "center",
  },
  investButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
