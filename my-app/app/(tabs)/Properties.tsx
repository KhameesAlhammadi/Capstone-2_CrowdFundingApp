import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth, db } from '../../firebaseconfig/firebase';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';

import Header from '../header/header';

// const db = getFirestore(firebaseApp);
// const storage = getStorage(firebaseApp);

export default function PropertiesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [specificArea, setSpecificArea] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(data);
    });
    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const uploadProperty = async () => {
    if (!image || !propertyName || !city || !rooms || !price || !propertyType) {
      alert('All fields are required!');
      return;
    }

    setUploading(true);
    try {
      const imageRef = ref(storage, `images/${Date.now()}`);
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const newProperty = {
        property_name: propertyName,
        description,
        city,
        location: city === "Abu Dhabi" ? specificArea : city, // Stores specific area for Abu Dhabi, city for Dubai
        rooms: parseInt(rooms),
        price: parseFloat(price),
        imageUrl,
        type: propertyType,
      };

      await addDoc(collection(db, 'properties'), newProperty);

      setPropertyName('');
      setDescription('');
      setCity('');
      setSpecificArea('');
      setRooms('');
      setPrice('');
      setImage(null);
      setPropertyType('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Sticky header outside scroll view */}
      <Header />
    <View style={styles.container}>
      
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Properties</Text>

      <FlatList
  data={properties}
  keyExtractor={(item) => item.id}
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.propertyList}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("invest", { property: item })}
      style={styles.propertyContainer}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.propertyImage} />
      <Text style={styles.propertyTitle}>{item.property_name}</Text>
      <Text style={styles.propertyLocation}>{item.location}</Text>
      <Text style={styles.propertyRooms}>{item.rooms}</Text>
      <Text style={styles.propertyPrice}>{item.price}</Text>
  
      <Progress.Bar
        progress={0.5} 
        width={150}
        color="#2196f3"
        style={{ marginTop: 8 }}
      />
    </TouchableOpacity>
  )}
  
/>


      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={30} color="white" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Property</Text>

            {/* Image Upload */}
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.propertyImage} />
              ) : (
                <Text style={styles.imagePlaceholderText}>Tap to upload image</Text>
              )}
            </TouchableOpacity>

            <View style={styles.formContainer}>
              {/* Property Name & Description */}
              <TextInput placeholder="Property Name" style={styles.input} value={propertyName} onChangeText={setPropertyName} />
              <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />

              {/* Rooms & Price in a Row */}
              <View style={styles.rowContainer}>
                <TextInput placeholder="Rooms" style={styles.smallInput} value={rooms} onChangeText={setRooms} keyboardType="numeric"/>
                <TextInput placeholder="Price (AED)" style={styles.smallInput} value={price} onChangeText={setPrice} keyboardType="numeric"/>
              </View>

              {/* Property Type Dropdown */}
              <Picker selectedValue={propertyType} onValueChange={setPropertyType} style={styles.picker}>
                <Picker.Item label="Select Property Type" value="" />
                <Picker.Item label="Villa" value="Villa" />
                <Picker.Item label="Apartment" value="Apartment" />
              </Picker>

              {/* City Dropdown */}
              <Picker selectedValue={city} onValueChange={(itemValue) => { setCity(itemValue); setSpecificArea(''); }} style={styles.picker}>
                <Picker.Item label="Select City" value="" />
                <Picker.Item label="Abu Dhabi" value="Abu Dhabi" />
                <Picker.Item label="Dubai" value="Dubai" />
              </Picker>

              {/* Specific Area Dropdown */}
              {city === "Abu Dhabi" && (
                <Picker selectedValue={specificArea} onValueChange={setSpecificArea} style={styles.picker}>
                  <Picker.Item label="Select Area" value="" />
                  <Picker.Item label="Al Reem Island" value="Al Reem Island" />
                  <Picker.Item label="Saadiyat Island" value="Saadiyat Island" />
                  <Picker.Item label="Al Raha Beach" value="Al Raha Beach" />
                  <Picker.Item label="Al Reef" value="Al Reef" />
                  <Picker.Item label="Khalifa City" value="Khalifa City" />
                  <Picker.Item label="Yas Island" value="Yas Island" />
                </Picker>
              )}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={uploadProperty}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </View>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  propertyList: { paddingHorizontal: 10, alignItems: 'center'},
  propertyContainer: { marginRight: 15, alignItems: 'center', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
  propertyImage: { width: 150, height: 150, borderRadius: 5 },
  propertyTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  propertyLocation: { fontSize: 12, color: '#666', textAlign: 'center' },
  propertyRooms: { fontSize: 12, fontWeight: 'bold', color: '#555', textAlign: 'center' },
  propertyPrice: { fontSize: 14, fontWeight: 'bold', color: '#28a745', textAlign: 'center' },
  addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007bff', width: 55, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginBottom: 0,
  },
  imagePicker: {
    width: '100%',
    height: 160,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 8, // Reduced spacing
  },
  
  dropdownLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
  },
  
  picker: {
    height: 45, // Reduce height
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  
  pickerItem: {
    fontSize: 16,
    color: '#000',
  },
  
  dropdownWrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  
  inputContainer: {
    width: '100%',
    marginBottom: 8, // Less space between fields
  },
  
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  
  smallInput: {
    width: '48%', // Makes the inputs take half the width each
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  
  
};
