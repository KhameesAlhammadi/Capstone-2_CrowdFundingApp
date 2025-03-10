import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as Progress from 'react-native-progress'; // Install this: `npm install react-native-progress`

export default function InvestPage() {
  const [investmentAmount, setInvestmentAmount] = useState(0);

  const increaseAmount = () => setInvestmentAmount(prev => prev + 100);
  const decreaseAmount = () => setInvestmentAmount(prev => (prev > 0 ? prev - 100 : 0));

  const handleInvest = () => {
    alert(`You have invested AED ${investmentAmount}`);
  };

  return (
    <View style={styles.container}>
      {/* Property Card */}
      <View style={styles.card}>
        <Image
          source={require('./assets/property.jpg')} // Replace with your image path
          style={styles.image}
        />
        <View style={styles.cardContent}>
          <Text style={styles.propertyDetails}>🏠 2  • Ready  • 🇦🇪 Dubai</Text>
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

      {/* Investment Amount Controls */}
      <View style={styles.amountControl}>
        <TouchableOpacity style={styles.adjustButton} onPress={decreaseAmount}>
          <Text style={styles.adjustText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.amountText}>AED {investmentAmount}</Text>
        <TouchableOpacity style={styles.adjustButton} onPress={increaseAmount}>
          <Text style={styles.adjustText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Invest Button */}
      <TouchableOpacity style={styles.investButton} onPress={handleInvest}>
        <Text style={styles.investButtonText}>Invest Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
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
    borderRadius: 50,
    padding: 12,
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
    borderRadius: 10,
    alignItems: "center",
  },
  investButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
