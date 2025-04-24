import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Text, StyleSheet } from "react-native";
// import SearchBar from "../SearchBar";
import { fetchProperties } from "../services/propertyService"; // Mock data
import { collection, getDoc, doc, getDocs} from "firebase/firestore";
import {db} from "../../firebaseconfig/firebase";

const PropertyList = () => {
  const [property, setProperty] = useState([]);



useEffect(() => {
const fetchProperty = async () => {
  try{
    const propertiesCollection = collection(db , 'properties')
    const proportySnapshot = await getDocs(propertiesCollection);
    const propertyList = proportySnapshot.docs.map(doc => (
      {  
      id: doc.id,
      ...doc.data(),
    }
  )
);

    // setProperty(propertyList);
   

    }catch(error){
    console.error('Error fetching users: ', error);
  }
};

  fetchProperty();
}, []);


return (
  <View>
    {/* {loading ? <Text>Loading...</Text> : <Text>{property.length} Properties Loaded</Text>} */}
  </View>
  );
};

export default PropertyList;