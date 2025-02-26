import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../firebase';
import { AntDesign } from '@expo/vector-icons';

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

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
    if (!image || !title || !location || !price) {
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

      await addDoc(collection(db, 'properties'), {
        title,
        location,
        price,
        imageUrl,
      });

      setTitle('');
      setLocation('');
      setPrice('');
      setImage(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Properties</Text>

      {/* Horizontal Scroll List */}
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        horizontal  // Enable side-scrolling
        showsHorizontalScrollIndicator={false}  // Hide the scrollbar
        contentContainerStyle={styles.propertyList}
        renderItem={({ item }) => (
          <View style={styles.propertyContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.propertyImage} />
            <Text style={styles.propertyTitle}>{item.title}</Text>
            <Text style={styles.propertyLocation}>{item.location}</Text>
            <Text style={styles.propertyPrice}>{item.price} AED</Text>
          </View>
        )}
      />
      
      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={30} color="white" />
      </TouchableOpacity>

      {/* Add Property Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Property</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.propertyImage} />
              ) : (
                <Text style={styles.imagePlaceholderText}>Tap to upload image</Text>
              )}
            </TouchableOpacity>
            <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
            <TextInput placeholder="Location" style={styles.input} value={location} onChangeText={setLocation} />
            <TextInput placeholder="Price" style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
            {uploading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <TouchableOpacity style={styles.submitButton} onPress={uploadProperty}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  propertyList: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  propertyContainer: {
    marginRight: 15,  
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 160,  
  },
  propertyImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  propertyLocation: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  propertyPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    marginBottom: 15,
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
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
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
};
