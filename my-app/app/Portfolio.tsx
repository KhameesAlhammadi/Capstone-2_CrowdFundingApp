import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Divider, DataTable } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from "./Header/Headers";



const { width } = Dimensions.get('window');
const db = getFirestore();
const auth = getAuth();

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [portfolio, setPortfolio] = useState<{
    portfolioValue: number;
    monthlyIncome: number;
    totalRentalIncome: number;
    totalAppreciation: number;
    numberOfProperties: number;
    occupancyRate: number;
    annualRentalYield: number;
    annualLimit: number;
    investedLast12Months: number;
    availableToInvest: number;
    stakes: { propertyId: string; location: string; investmentValue: number; status: string }[];
  }>({
    portfolioValue: 0,
    monthlyIncome: 0,
    totalRentalIncome: 0,
    totalAppreciation: 0,
    numberOfProperties: 0,
    occupancyRate: 0,
    annualRentalYield: 0,
    annualLimit: 367000,
    investedLast12Months: 0,
    availableToInvest: 0,
    stakes: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const investorsSnapshot = await getDocs(collection(db, 'investors'));
        const investmentsMap = new Map<string, number>();

        for (const docSnap of investorsSnapshot.docs) {
          const data = docSnap.data();
          if (data.userId === userId) {
            const propertyId = data.propertyId;
            const investmentAmount = Number(data.investmentAmount);
            const currentInvestment = investmentsMap.get(propertyId) || 0;
            investmentsMap.set(propertyId, currentInvestment + investmentAmount);
          }
        }
        
        let totalPortfolioValue = 0;
        let totalRentalIncome = 0;
        let totalAppreciation = 0;
        let numberOfProperties = 0;
        let stakes: {
          propertyId: string;
          location: string;
          investmentValue: number;
          status: string;
          sharePercentage: number;
        }[] = [];
        
        for (const [propertyId, userInvestment] of investmentsMap.entries()) {
          const propertyRef = doc(db, 'properties', propertyId);
          const propertySnap = await getDoc(propertyRef);
          const propertyData = propertySnap.exists() ? propertySnap.data() : null;
        
          if (propertyData) {
            const rentalIncome = Number(propertyData.total_rental_income) || 0;
            const appreciation = Number(propertyData.total_appreciation) || 0;
            const price = Number(propertyData.price) || 1;
            const percentage = userInvestment / price;
        
            totalPortfolioValue += userInvestment;
            totalRentalIncome += rentalIncome * percentage;
            totalAppreciation += appreciation * percentage;
            numberOfProperties++;
        
            stakes.push({
              propertyId,
              location: propertyData.location || 'N/A',
              investmentValue: userInvestment,
              status: propertyData.status || 'Active',
              sharePercentage: Number((percentage * 100).toFixed(2)),
            });
          }
        }
        
        
        const annualLimit = 367000;
        const investedLast12Months = totalPortfolioValue;
        const availableToInvest = annualLimit - investedLast12Months;
        const monthlyIncome = totalRentalIncome / 12;
        const annualRentalYield = totalPortfolioValue > 0
          ? (totalRentalIncome / totalPortfolioValue) * 100
          : 0;
        const occupancyRate = numberOfProperties > 0 ? 100 : 0;

        setPortfolio({
          portfolioValue: totalPortfolioValue,
          monthlyIncome,
          totalRentalIncome,
          totalAppreciation,
          numberOfProperties,
          occupancyRate,
          annualRentalYield,
          annualLimit,
          investedLast12Months,
          availableToInvest,
          stakes
        });
        setLoading(false);
      } catch (error) {
        console.error("🔥 Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Sticky header outside scroll view */}
      <Header />
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <Card style={styles.card}>
     
        <Card.Title title="Portfolio Value" left={(props) => <MaterialIcons {...props} name="account-balance-wallet" size={24} />} />
        <Card.Content>
          <Text style={styles.value}>AED {portfolio.portfolioValue}</Text>
          <Text style={styles.description}>
            This is the total amount you’ve invested across all properties.
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.rowContainer}>
        <Card style={styles.card}><Card.Title title="Monthly Income" subtitle={`AED ${portfolio.monthlyIncome.toFixed(2)}`} /></Card>
        <Card style={styles.card}><Card.Title title="Total Rental Income" subtitle={`AED ${portfolio.totalRentalIncome}`} /></Card>
        <Card style={styles.card}><Card.Title title="Total Appreciation" subtitle={`AED ${portfolio.totalAppreciation}`} /></Card>
      </View>
    
      <View style={styles.rowContainer}>
        <Card style={styles.card}><Card.Title title="Number of Properties" subtitle={`${portfolio.numberOfProperties}`} /></Card>
        <Card style={styles.card}><Card.Title title="Occupancy Rate" subtitle={`${portfolio.occupancyRate.toFixed(2)}%`} /></Card>
        <Card style={styles.card}><Card.Title title="Annual Rental Yield" subtitle={`${portfolio.annualRentalYield.toFixed(2)}%`} /></Card>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Annual Investment Limit" />
        <Card.Content>
          <Text>Annual Limit: AED {portfolio.annualLimit}</Text>
          <Text>Invested in last 12 months: AED {portfolio.investedLast12Months}</Text>
          <Text>Available to invest: AED {portfolio.availableToInvest}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="My Stakes" />
        <Divider />
        {portfolio.stakes.length === 0 ? (
          <Card.Content><Text>No investments found</Text></Card.Content>
        ) : (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Property ID</DataTable.Title>
              <DataTable.Title>Location</DataTable.Title>
              <DataTable.Title>Investment (AED)</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title>Percentage</DataTable.Title>
            </DataTable.Header>
            {portfolio.stakes.map((stake, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{stake.propertyId}</DataTable.Cell>
                <DataTable.Cell>{stake.location}</DataTable.Cell>
                <DataTable.Cell>{stake.investmentValue}</DataTable.Cell>
                <DataTable.Cell>{stake.status}</DataTable.Cell>
                <DataTable.Cell>{stake.sharePercentage}%</DataTable.Cell>

              </DataTable.Row>
            ))}
          </DataTable>
        )}
      </Card>
    </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 16, padding: 10, backgroundColor: "#fefdff" },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  value: { fontSize: 24, fontWeight: 'bold', color: '#000' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
 
  }
});

export default Dashboard;