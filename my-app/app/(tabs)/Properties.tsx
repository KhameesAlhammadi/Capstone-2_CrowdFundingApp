import React, { useState, useEffect, useRef } from 'react';
import {
  Text, View, FlatList, TouchableOpacity, Image, StatusBar,
  StyleSheet, useWindowDimensions, Modal, TextInput, ScrollView
} from 'react-native';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseconfig/firebase';
import Header from '../Header/Headers';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [propertyName, setPropertyName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [specificArea, setSpecificArea] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const navigation = useNavigation();
  const scrollRef = useRef();
  const { width } = useWindowDimensions();
  const cardSize = width > 768 ? 200 : 160;
  const numCols = Math.floor(width / (cardSize + 20));

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const filled =
      image && propertyName && description && city &&
      (city !== 'Abu Dhabi' || specificArea) &&
      rooms && !isNaN(rooms) &&
      price && !isNaN(price) &&
      propertyType;
    const hasErrors = Object.values(errors).some(x => x);
    setIsFormValid(filled && !hasErrors);
  }, [image, propertyName, description, city, specificArea, rooms, price, propertyType, errors]);

  const handleInputChange = (field, value) => {
    if ((field === 'rooms' || field === 'price') && isNaN(value)) return;

    const setters = {
      propertyName: setPropertyName,
      description: setDescription,
      city: setCity,
      specificArea: setSpecificArea,
      rooms: setRooms,
      price: setPrice,
      propertyType: setPropertyType
    };

    setters[field](value);
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) setImage(result.assets[0].uri);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const scrollToError = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const validateAndSubmit = async () => {
    let err = {};
    if (!image) err.image = 'Image is required.';
    if (!propertyName) err.propertyName = 'Property name is required.';
    if (!description) err.description = 'Description is required.';
    if (!city) err.city = 'City is required.';
    if (city === 'Abu Dhabi' && !specificArea) err.specificArea = 'Area is required.';
    if (!rooms || isNaN(rooms)) err.rooms = 'Valid room count required.';
    if (!price || isNaN(price)) err.price = 'Valid price required.';
    if (!propertyType) err.propertyType = 'Property type is required.';

    setErrors(err);
    if (Object.keys(err).length > 0) return scrollToError();

    setUploading(true);
    try {
      const refImg = ref(storage, `images/${Date.now()}`);
      const blob = await (await fetch(image)).blob();
      await uploadBytes(refImg, blob);
      const imageUrl = await getDownloadURL(refImg);

      await addDoc(collection(db, 'properties'), {
        property_name: propertyName,
        description,
        city,
        location: city === 'Abu Dhabi' ? specificArea : city,
        rooms: parseInt(rooms),
        price: parseFloat(price),
        imageUrl,
        type: propertyType,
        tag: 'Available'
      });

      setModalVisible(false);
      setImage(null); setPropertyName(''); setDescription('');
      setCity(''); setSpecificArea(''); setRooms(''); setPrice('');
      setPropertyType(''); setErrors({});
    } catch (e) {
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.header}>Explore Properties</Text>

        <FlatList
          key={numCols}
          data={properties}
          keyExtractor={(item) => item.id}
          numColumns={numCols}
          contentContainerStyle={styles.propertyList}
          columnWrapperStyle={{ justifyContent: 'center', gap: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { width: cardSize, height: cardSize + 110 }]}>
              <TouchableOpacity onPress={() => navigation.navigate("invest", { property: item })}>
                <View style={[styles.imageWrapper, { height: cardSize }]}>
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  <View style={styles.badge}><Text style={styles.badgeText}>{item.tag || 'Available'}</Text></View>
                  <TouchableOpacity style={styles.heart}>
                    <AntDesign name="hearto" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.title}>{item.property_name}</Text>
                  <Text style={styles.location}>{item.location}</Text>
                  <Text style={styles.price}>{item.price} AED</Text>
                  <Progress.Bar progress={0.5} width="100%" color="#27ae60" height={6} borderWidth={0} />
                  <Text style={styles.progressLabel}>50% funded</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={30} color="#fff" />
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Property</Text>

              <TouchableOpacity onPress={pickImage} style={[styles.imagePicker, errors.image && styles.invalid]}>
                {image ? <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} /> :
                  <Text style={styles.imagePlaceholderText}>Tap to upload image</Text>}
              </TouchableOpacity>
              {errors.image && <Text style={styles.error}>{errors.image}</Text>}

              <TextInput
                placeholder="Property Name"
                value={propertyName}
                onChangeText={(val) => handleInputChange('propertyName', val)}
                style={[styles.input, errors.propertyName && styles.invalid]}
              />
              {errors.propertyName && <Text style={styles.error}>{errors.propertyName}</Text>}

              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={(val) => handleInputChange('description', val)}
                style={[styles.input, errors.description && styles.invalid]}
              />
              {errors.description && <Text style={styles.error}>{errors.description}</Text>}

              <View style={styles.rowContainer}>
                <TextInput
                  placeholder="Rooms"
                  value={rooms}
                  onChangeText={(val) => handleInputChange('rooms', val)}
                  style={[styles.smallInput, errors.rooms && styles.invalid]}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Price (AED)"
                  value={price}
                  onChangeText={(val) => handleInputChange('price', val)}
                  style={[styles.smallInput, errors.price && styles.invalid]}
                  keyboardType="numeric"
                />
              </View>
              {errors.rooms && <Text style={styles.error}>{errors.rooms}</Text>}
              {errors.price && <Text style={styles.error}>{errors.price}</Text>}

              <Picker
                selectedValue={propertyType}
                onValueChange={(val) => handleInputChange('propertyType', val)}
                style={[styles.input, errors.propertyType && styles.invalid]}>
                <Picker.Item label="Select Property Type" value="" />
                <Picker.Item label="Villa" value="Villa" />
                <Picker.Item label="Apartment" value="Apartment" />
              </Picker>
              {errors.propertyType && <Text style={styles.error}>{errors.propertyType}</Text>}

              <Picker
                selectedValue={city}
                onValueChange={(val) => handleInputChange('city', val)}
                style={[styles.input, errors.city && styles.invalid]}>
                <Picker.Item label="Select City" value="" />
                <Picker.Item label="Abu Dhabi" value="Abu Dhabi" />
                <Picker.Item label="Dubai" value="Dubai" />
              </Picker>
              {errors.city && <Text style={styles.error}>{errors.city}</Text>}

              {city === 'Abu Dhabi' && (
                <>
                  <Picker
                    selectedValue={specificArea}
                    onValueChange={(val) => handleInputChange('specificArea', val)}
                    style={[styles.input, errors.specificArea && styles.invalid]}>
                    <Picker.Item label="Select Area" value="" />
                    <Picker.Item label="Al Reem Island" value="Al Reem Island" />
                    <Picker.Item label="Saadiyat Island" value="Saadiyat Island" />
                    <Picker.Item label="Al Raha Beach" value="Al Raha Beach" />
                    <Picker.Item label="Al Reef" value="Al Reef" />
                    <Picker.Item label="Khalifa City" value="Khalifa City" />
                    <Picker.Item label="Yas Island" value="Yas Island" />
                  </Picker>
                  {errors.specificArea && <Text style={styles.error}>{errors.specificArea}</Text>}
                </>
              )}

              <TouchableOpacity
                style={[styles.submitButton, !isFormValid && { backgroundColor: '#999' }]}
                onPress={validateAndSubmit}
                disabled={!isFormValid}
              >
                <Text style={styles.submitButtonText}>{uploading ? 'Uploading...' : 'Submit'}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 40 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#1a1a1a' },
  propertyList: { paddingBottom: 100 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  imageWrapper: { width: '100%', overflow: 'hidden', position: 'relative', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#27ae60', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  heart: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 4 },
  cardBody: { padding: 10, alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 2, textAlign: 'center' },
  location: { fontSize: 12, color: '#666', marginBottom: 2 },
  price: { fontSize: 13, fontWeight: 'bold', color: '#27ae60' },
  progressLabel: { fontSize: 10, color: '#999', marginTop: 4 },
  addButton: {
    position: 'absolute', bottom: 30, right: 20, backgroundColor: '#007bff',
    width: 55, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    maxHeight: '90%',
  },  
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  imagePicker: {
    width: '100%', height: 150, backgroundColor: '#f1f1f1',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#ccc'
  },
  imagePlaceholderText: { color: '#666', fontSize: 14 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  smallInput: { width: '48%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  submitButton: { backgroundColor: '#007bff', paddingVertical: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { marginTop: 10, color: 'red', fontWeight: 'bold', textAlign: 'center' },
  error: { color: 'red', fontSize: 12, marginTop: -6, marginBottom: 6, alignSelf: 'flex-start' },
  invalid: { borderColor: 'red' },
});
