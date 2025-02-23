import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseconfig/firebase";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Added forgot password state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Email and Password are required.");
      return;
    }

    if (isSignUp) {
      if (!firstName.trim() || !lastName.trim()) {
        setError("First Name and Last Name are required.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match. Try again!");
        return;
      }
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage(`Account created successfully! 🎉 Welcome, ${firstName} ${lastName}!`);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMessage("Logged in successfully! 🎉");
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleResetPassword = () => {
    setError("");
    setSuccessMessage("");

    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      setError("Both fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match. Try again!");
      return;
    }

    setSuccessMessage("Password reset successful! 🎉");
    setIsForgotPassword(false); // Switch back to sign-in form
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccessMessage("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccessMessage("Logged in with Google successfully! 🎉");
    } catch (err: any) {
      setError("Google Sign-In failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {!isForgotPassword ? ( // Show login/signup form
          <View>
            <Text style={styles.title}>{isSignUp ? "Create an Account" : "Sign In"}</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

            {isSignUp && (
              <View>
                <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
                <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
              </View>
            )}

            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

            {!isSignUp && (
              <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
                <Text style={styles.toggleText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {isSignUp && (
              <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
            </TouchableOpacity>

            {/* Google Sign-In Button */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
              <Image source={require("../assets/images/GoogleLogo.png")} style={styles.googleLogo} />
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccessMessage("");
                setFirstName("");
                setLastName("");
              }}
            >
              <Text style={styles.toggleText}>{isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</Text>
            </TouchableOpacity>
          </View>
        ) : ( // Show forgot password form
          <View>
            <Text style={styles.title}>Reset Password</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

            <TextInput style={styles.input} placeholder="Enter New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirm New Password" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsForgotPassword(false)}>
              <Text style={styles.toggleText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
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
  success: {
    color: "green",
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
