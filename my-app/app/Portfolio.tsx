import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Divider , DataTable} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { initializeApp } from 'firebase/app';

const { width } = Dimensions.get('window');


// Uncomment and replace with your Firebase config when ready
/*
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

// Initialize Firebase safely
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error", error);
}
const db = app ? getFirestore(app) : null;
const userId = "USER_UNIQUE_ID"; // Replace this with the authenticated user's ID

// Fetch Data from Firestore
useEffect(() => {
  if (!db) return;
  const fetchData = async () => {
    try {
      const propertiesSnapshot = await getDocs(query(collection(db, 'Property'), where('userId', '==', userId)));
      const portfolioSnapshot = await getDocs(query(collection(db, 'Portfolio'), where('userId', '==', userId)));
      const paymentsSnapshot = await getDocs(query(collection(db, 'Payment'), where('userId', '==', userId)));
      
      let totalPortfolioValue = 0;
      let totalRentalIncome = 0;
      let totalAppreciation = 0;
      let numberOfProperties = propertiesSnapshot.size;
      let investedAmount = 0;
      let stakes = [];
      
      propertiesSnapshot.forEach(doc => {
        const property = doc.data();
        totalPortfolioValue += property.Amount_of_investments;
        totalRentalIncome += property.Total_rental_income || 0;
        totalAppreciation += property.Total_appreciation || 0;
        
        stakes.push({
          property: property.Property_ID,
          location: property.Property_Location,
          investmentValue: property.Amount_of_investments,
          totalRentalIncome: property.Total_rental_income || 0,
          status: property.Status || 'Active',
        });
      });

      portfolioSnapshot.forEach(doc => {
        investedAmount += doc.data().Amount_of_investments;
      });

      setPortfolio({
        portfolioValue: totalPortfolioValue,
        monthlyIncome: totalRentalIncome / 12,
        totalRentalIncome,
        totalAppreciation,
        numberOfProperties,
        occupancyRate: numberOfProperties > 0 ? 100 : 0,
        annualRentalYield: totalPortfolioValue > 0 ? (totalRentalIncome / totalPortfolioValue) * 100 : 0,
        annualLimit: 367000,
        investedLast12Months: investedAmount,
        availableToInvest: 367000 - investedAmount,
        stakes,
      });
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    }
  };
  fetchData();
}, [db]);
*/

// Sample JSON Data instead of Firestore (Based on Database Structure)
const sampleData = {
  portfolio: {
    portfolioValue: 75000, // Sum of investments from Portfolio table
    amountOfInvestments: 75000, // Total invested amount
  },
  properties: [
    {
      propertyId: "PROP001",
      location: "Dubai Marina",
      totalRentalIncome: 24000, // Annual rental income
      remainingAmount: 5000, // Appreciation
      status: "Active",
    },
    {
      propertyId: "PROP002",
      location: "Abu Dhabi",
      totalRentalIncome: 36000,
      remainingAmount: 7000,
      status: "Active",
    },
  ],
  buyer: {
    investments: [
      {
        propertyId: "PROP001",
        investmentAmount: 40000,
      },
      {
        propertyId: "PROP002",
        investmentAmount: 35000,
      },
    ],
  },
  payments: [
    {
      paymentId: "PAY001",
      amount: 10000,
      method: "Debit Card",
    },
    {
      paymentId: "PAY002",
      amount: 5000,
      method: "Credit Card",
    },
  ],
};

// Calculations Based on Sample Data
const calculatePortfolio = (data) => {
  const totalRentalIncome = data.properties.reduce((sum, prop) => sum + prop.totalRentalIncome, 0);
  const totalAppreciation = data.properties.reduce((sum, prop) => sum + prop.remainingAmount, 0);
  const numberOfProperties = data.buyer.investments.length;
  const occupancyRate = (numberOfProperties / data.properties.length) * 100;
  const annualRentalYield = (totalRentalIncome / data.portfolio.portfolioValue) * 100;
  const investedLast12Months = data.portfolio.amountOfInvestments;
  const availableToInvest = 367000 - investedLast12Months;

  return {
    portfolioValue: data.portfolio.portfolioValue,
    monthlyIncome: totalRentalIncome / 12,
    totalRentalIncome,
    totalAppreciation,
    numberOfProperties,
    occupancyRate,
    annualRentalYield,
    annualLimit: 367000,
    investedLast12Months,
    availableToInvest,
  };
};


const Dashboard = () => {
  const [portfolio, setPortfolio] = useState(calculatePortfolio(sampleData));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Card style={styles.card}>
        <Card.Title title="Portfolio Value" left={(props) => <MaterialIcons {...props} name="account-balance-wallet" size={24} />} />
        <Card.Content>
          <Text style={styles.value}>AED {portfolio.portfolioValue}</Text>
        </Card.Content>
      </Card>

      <View style={styles.gridContainer}>
        <Card style={styles.gridItem}><Card.Title title="Monthly Income" subtitle={`AED ${portfolio.monthlyIncome}`} left={(props) => <MaterialIcons {...props} name="attach-money" size={24} />} /></Card>
        <Card style={styles.gridItem}><Card.Title title="Total Rental Income" subtitle={`AED ${portfolio.totalRentalIncome}`} left={(props) => <MaterialIcons {...props} name="real-estate-agent" size={24} />} /></Card>
        <Card style={styles.gridItem}><Card.Title title="Total Appreciation" subtitle={`AED ${portfolio.totalAppreciation}`} left={(props) => <MaterialIcons {...props} name="trending-up" size={24} />} /></Card>
        <Card style={styles.gridItem}><Card.Title title="Number of Properties" subtitle={portfolio.numberOfProperties} left={(props) => <MaterialIcons {...props} name="home" size={24} />} /></Card>
        <Card style={styles.gridItem}><Card.Title title="Occupancy Rate" subtitle={`${portfolio.occupancyRate.toFixed(2)}%`} left={(props) => <MaterialIcons {...props} name="check-circle" size={24} />} /></Card>
        <Card style={styles.gridItem}><Card.Title title="Annual Rental Yield" subtitle={`${portfolio.annualRentalYield.toFixed(2)}%`} left={(props) => <MaterialIcons {...props} name="bar-chart" size={24} />} /></Card>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Annual Investment Limit" left={(props) => <MaterialIcons {...props} name="monetization-on" size={24} />} />
        <Card.Content>
          <Text>Annual Limit: AED {portfolio.annualLimit}</Text>
          <Text>Invested in last 12 months: AED {portfolio.investedLast12Months}</Text>
          <Text>Available to invest: AED {portfolio.availableToInvest}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="My Stakes" left={(props) => <MaterialIcons {...props} name="business-center" size={24} />} />
        <Divider />
        {portfolio.numberOfProperties === 0 ? (
          <Card.Content><Text>No investments found</Text></Card.Content>
        ) : (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Property</DataTable.Title>
              <DataTable.Title>Location</DataTable.Title>
              <DataTable.Title>Investment (AED)</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>
            {sampleData.buyer.investments.map((stake, index) => {
              const property = sampleData.properties.find(p => p.propertyId === stake.propertyId);
              return (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{stake.propertyId}</DataTable.Cell>
                  <DataTable.Cell>{property?.location || 'N/A'}</DataTable.Cell>
                  <DataTable.Cell>{stake.investmentAmount}</DataTable.Cell>
                  <DataTable.Cell>{property?.status || 'N/A'}</DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 16, padding: 10, backgroundColor:"#fefdff"},
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: width * 0.45, marginBottom: 10, padding: 10, backgroundColor:"white" },
  value: { fontSize: 24, fontWeight: 'bold', color: '#000' },
});

export default Dashboard;