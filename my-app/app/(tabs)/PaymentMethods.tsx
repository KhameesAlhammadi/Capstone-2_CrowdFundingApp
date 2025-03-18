import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
} from 'react-native';

export default function PaymentScreen() {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState('');
  const [payButtonScale] = useState(new Animated.Value(1));
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const handlePayment = () => {
    if (paymentMethod === 'paypal') {
      alert(`✅ Payment Successful via PayPal!\nAmount: ${amount || 'Custom'}`);
    } else {
      alert(`💳 Payment Successful!\nAmount: ${amount || 'Custom'}\nCard: **** ${cardNumber.slice(-4)}`);
    }
  };

  // Format card number (xxxx xxxx xxxx xxxx)
  const formatCardNumber = (input: string) => {
    return input
      .replace(/\s?/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
  };

  // Format expiry date (MM/YY)
  const formatExpiry = (input: string) => {
    return input
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{0,2})$/, '$1/$2')
      .substring(0, 5);
  };

  // Validate if all fields are filled correctly
  const isFormValid =
    paymentMethod === 'paypal' || (cardNumber.length === 19 && expiry.length === 5 && cvv.length === 3);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Choose Payment Method</Text>

      {/* Payment Method Selection */}
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[styles.paymentMethod, paymentMethod === 'card' && styles.selectedMethod]}
          onPress={() => setPaymentMethod('card')}
        >
          <Text style={styles.methodText}>💳 Pay with Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentMethod, paymentMethod === 'paypal' && styles.selectedMethod]}
          onPress={() => setPaymentMethod('paypal')}
        >
          <Image source={require('../../assets/images/paypal.png')} style={styles.paypalLogo} />
        </TouchableOpacity>
      </View>

      {/* Amount Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="Enter Amount"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Card Details (Hidden if PayPal is selected) */}
      {paymentMethod === 'card' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          <TextInput
            placeholder="Card Number"
            style={styles.input}
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            keyboardType="numeric"
            maxLength={19}
          />
          <View style={styles.row}>
            <TextInput
              placeholder="Expiry (MM/YY)"
              style={[styles.input, styles.halfInput]}
              value={expiry}
              onChangeText={(text) => setExpiry(formatExpiry(text))}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              placeholder="CVV"
              style={[styles.input, styles.halfInput]}
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              secureTextEntry
              maxLength={3}
            />
          </View>
        </View>
      )}

      {/* Message Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Message (Optional)</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Enter a message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.payButton, !isFormValid && styles.disabledButton]}
          onPress={handlePayment}
          disabled={!isFormValid}
        >
          <Text style={styles.payText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  paymentMethod: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  selectedMethod: {
    backgroundColor: '#007bff',
  },
  methodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  paypalLogo: {
    width: 80,
    height: 24,
    resizeMode: 'contain',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amountInput: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  messageInput: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  button: {
    flex: 1,
    maxWidth: 180,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  payButton: {
    backgroundColor: '#007bff',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  payText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
