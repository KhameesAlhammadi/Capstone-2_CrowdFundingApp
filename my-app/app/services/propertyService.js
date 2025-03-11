// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebaseconfig/firebase"; // Firestore setup (commented out)

// Sample Data (Mock Database)
const sampleData = {
    users: [
      {
        id: "user1",
        email: "buyer@example.com",
        password: "hashedpassword",
        phone: "123456789",
        EID: 12345678,
        address: "Al Shamkha, Abu Dhabi",
        faceImage: "https://example.com/user1.jpg",
        type: "buyer", // Can be "buyer" or "seller"
        portfolio: {
          portfolioId: "portfolio1",
          portfolioValue: "500,000 AED",
          amountOfInvestments: 250000,
        }
      },
      {
        id: "user2",
        email: "seller@example.com",
        password: "hashedpassword",
        phone: "987654321",
        EID: 87654321,
        address: "Downtown, Dubai",
        faceImage: "https://example.com/user2.jpg",
        type: "seller", // Can be "buyer" or "seller"
      }
    ],
    properties: [
      {
        propertyId: "property1",
        propertyNumber: 101,
        propertyLocation: "Al Bedaa, Dubai",
        propertyDescription: "Luxury villa with a swimming pool.",
        type: "Villa",
        villaType: "Commercial",
        price: "1,000,000 AED",
        remainingAmount: 600000,
        imageUrl: "https://example.com/villa1.jpg"
      },
      {
        propertyId: "property2",
        propertyNumber: 102,
        propertyLocation: "Downtown, Dubai",
        propertyDescription: "Modern apartment with city views.",
        type: "Apartment",
        apartmentType: "Luxury",
        floorLevel: "15th Floor",
        price: "850,000 AED",
        remainingAmount: 340000,
        imageUrl: "https://example.com/apartment1.jpg"
      }
    ],
    payments: [
      {
        paymentId: "payment1",
        amount: 50000,
        userId: "user1",
        method: "Debit Card",
        card: {
          cardNumber: 1234567812345678,
          cardHolderName: "John Doe",
          expiryDate: "12/26"
        }
      }
    ]
  };
  
  // Function to Fetch Properties (Simulating Firestore)
  export const fetchProperties = async () => {
    try {
      // Firestore fetching (Disabled for now)
      /*
      const querySnapshot = await getDocs(collection(db, "properties"));
      let properties = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
      });
      return properties;
      */
  
      // Return Sample Data Instead
      return sampleData.properties;
    } catch (error) {
      console.error("Error fetching properties: ", error);
    }
  };
  
  // Function to Fetch Users (Simulating Firestore)
  export const fetchUsers = async () => {
    return sampleData.users;
  };
  
  // Function to Fetch Payments (Simulating Firestore)
  export const fetchPayments = async () => {
    return sampleData.payments;
  };
  