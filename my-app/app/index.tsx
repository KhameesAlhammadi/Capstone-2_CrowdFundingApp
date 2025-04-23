import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebaseconfig/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const navigation = useNavigation<any>();


  const phoneRegex = /^(050|052|054|056|057|058)-\d{3}-\d{4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;
  
  const signIn = isSignUp ? "Sign In" : null;

  const nameRegex = /^[a-zA-Z0-9_+-]{6,}$/;
  const passwordRegex = /^[a-zA-Z0-9_!@#$%^&*()\-+=]{8,}$/;


  const handleSubmit = async () => {
    let newErrors: any = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };
    let hasError = false;
    setSuccessMessage("");

    

    if (isSignUp) {
      // First Name
      if (!firstName.trim()) {
        newErrors.firstName = "First name is required.";
        hasError = true;
      } else if (!nameRegex.test(firstName)) {
        newErrors.firstName = "At least 6 valid characters: letters, numbers, _ + -";
        hasError = true;
      }
    
      // Last Name
      if (!lastName.trim()) {
        newErrors.lastName = "Last name is required.";
        hasError = true;
      } else if (!nameRegex.test(lastName)) {
        newErrors.lastName = "At least 6 valid characters: letters, numbers, _ + -";
        hasError = true;
      }
    
      // Phone Number
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required.";
        hasError = true;
      } else if (!phoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber = "Use this format: 050-123-4567 (starts with 050, 052, 054, 056, 057, or 058)";
        hasError = true;
      }
    
      // Email
      if (!email.trim()) {
        newErrors.email = "Email is required.";
        hasError = true;
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Use a valid email abced@(gmail, yahoo, outlook).com";
        hasError = true;
      }
    
      // Password
      if (!password.trim()) {
        newErrors.password = "Password is required.";
        hasError = true;
      } else if (!passwordRegex.test(password)) {
        newErrors.password = "Minimum 8 characters. Only letters, numbers, and symbols _!@#$%^&*()-+=";
        hasError = true;
      }
    
      // Confirm Password
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password.";
        hasError = true;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
        hasError = true;
      }
    }
    
    if (signIn && email == "" && password == "")
      {
        if (!email.trim() ) {
          newErrors.email = "Email is required.";
          hasError = true;
        }
    
        if (!password.trim()) {
          newErrors.password = "Password is required.";
          hasError = true;
        }
      }

    
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        const userDetails = {
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
        };

        await setDoc(doc(db, "users", userId), userDetails);

        setSuccessMessage(`Account created successfully! Welcome, ${firstName} ${lastName}! 🎉`);
        setIsSignUp(false); // last stop here

      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMessage("Logged in successfully! 🎉");
        navigation.navigate("home");
      }

      setErrors({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        general: "",
      });
    } catch (err) {
      setErrors({ ...newErrors, general: isSignUp ? "An error occurred during sign up. Please try again." : "Login failed. Please check your credentials." });
    }
  };

  const handleForgotPassword = async () => {
    setErrors({ ...errors, general: "" });
    setSuccessMessage("");

    if (!email.trim()) {
      setErrors({ ...errors, email: "Please enter your email to reset password." });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setErrors({ ...errors, general: "Failed to send reset email. Please check your email and try again." });
    }
  };

  const handleGoogleSignIn = async () => {
    setErrors({ ...errors, general: "" });
    setSuccessMessage("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccessMessage("Logged in with Google successfully! 🎉");
      navigation.navigate("home");
    } catch (err) {
      setErrors({ ...errors, general: "Google Sign-In failed. Try again." });
    }
  };

  return (
    
    <View style={styles.container}>
      <ScrollView
      style={styles.scrollViewB}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
    
      <View style={styles.box}>
        <Text style={styles.title}>{isSignUp ? "Create an Account" : "Sign In"}</Text>
        {errors.general ? <Text style={styles.error}>{errors.general}</Text> : null}
        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

        {isSignUp && (
          <>
            {errors.firstName ? <Text style={styles.error}>{errors.firstName}</Text> : null}
            <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />

            {errors.lastName ? <Text style={styles.error}>{errors.lastName}</Text> : null}
            <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />

            {errors.phoneNumber ? <Text style={styles.error}>{errors.phoneNumber}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </>
        )}

        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {isSignUp && (
          <>
            {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </>
        )}

        {!isSignUp && (
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.toggleText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Image source={require("../assets/images/GoogleLogo.png")} style={styles.googleLogo} />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsSignUp(!isSignUp);
            setErrors({
              firstName: "",
              lastName: "",
              phoneNumber: "",
              email: "",
              password: "",
              confirmPassword: "",
              general: "",
            });
            setSuccessMessage("");
          }}
        >
          <Text style={styles.toggleText}>
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  
  scrollViewB: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    width: "100%",
    maxWidth: 400,
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
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  success: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
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
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 15,
    color: "#007bff",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
