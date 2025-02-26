import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { Redirect } from "expo-router";
// import {createStaticNavigation, useNavigation} from '@react-navigation/native';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  // const navigation = useNavigation();

  const handleSubmit = async () => {
    setError("");
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match, Try again with something harder!.");
      return;
    }
    try {
      if (isSignUp)
        {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up successfully");
      } 
      else 
      {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully");
        // navigation.navigate('Details');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("User signed in with Google");

    } catch (err: any) {
      setError(err.message);
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>{isSignUp ? "Create an Account" : "Sign In"}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>Or sign in with</Text>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Image source={require("../assets/images/GoogleLogo.png")} style={styles.googleLogo} />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.toggleText}>{isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 350,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 10,
    color: "#666",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#db4437",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  toggleText: {
    marginTop: 15,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
