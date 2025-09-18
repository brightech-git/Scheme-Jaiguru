import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../utils/toast";
import appTheme from "../../utils/Theme";
import styles from "./ServiceStyles";

const { COLORS } = appTheme;

function ServicePage({ navigation, onNavigateToOtp, onNavigateToLogin, onNavigateToRegister, onNavigateToForgotPassword, onNavigateToProfile }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ 
    contactNumber: "", 
    email: "" 
  });

  const handleLogin = async () => {
    try {
      const response = await fetch("https://your-api-base-url/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("authToken", data.token);
        showToast("Login successful!");
        onNavigateToProfile();
      } else {
        showToast("Invalid credentials");
      }
    } catch (error) {
      showToast("Login failed. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      showToast("Passwords don't match");
      return;
    }

    try {
      const response = await fetch("https://your-api-base-url/api/v1/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          showToast(data.message);
        } else {
          showToast("Registration successful! Please verify OTP.");
          await AsyncStorage.setItem("userContactNumber", registerData.contactNumber);
          onNavigateToOtp(registerData.contactNumber);
        }
      }
    } catch (error) {
      showToast("Registration failed. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("https://your-api-base-url/api/v1/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgotPasswordData),
      });

      if (response.ok) {
        showToast("Password reset instructions sent!");
      } else {
        showToast("Failed to process request");
      }
    } catch (error) {
      showToast("Request failed. Please try again.");
    }
  };

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={loginData.username}
        onChangeText={(text) => setLoginData({...loginData, username: text})}
        placeholder="Enter your username"
        placeholderTextColor={COLORS.textLight}
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={loginData.password}
        onChangeText={(text) => setLoginData({...loginData, password: text})}
        placeholder="Enter your password"
        placeholderTextColor={COLORS.textLight}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={onNavigateToForgotPassword}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleLogin}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.switchFormButton}
        onPress={() => setActiveTab("register")}
      >
        <Text style={styles.switchFormText}>
          Don't have an account? <Text style={styles.switchFormLink}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRegisterForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={registerData.username}
        onChangeText={(text) => setRegisterData({...registerData, username: text})}
        placeholder="Choose a username"
        placeholderTextColor={COLORS.textLight}
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={registerData.email}
        onChangeText={(text) => setRegisterData({...registerData, email: text})}
        placeholder="Enter your email"
        placeholderTextColor={COLORS.textLight}
        keyboardType="email-address"
      />
      
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={registerData.contactNumber}
        onChangeText={(text) => setRegisterData({...registerData, contactNumber: text})}
        placeholder="Enter 10-digit number"
        placeholderTextColor={COLORS.textLight}
        keyboardType="phone-pad"
        maxLength={10}
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={registerData.password}
        onChangeText={(text) => setRegisterData({...registerData, password: text})}
        placeholder="Create a password"
        placeholderTextColor={COLORS.textLight}
        secureTextEntry
      />
      
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={registerData.confirmPassword}
        onChangeText={(text) => setRegisterData({...registerData, confirmPassword: text})}
        placeholder="Confirm your password"
        placeholderTextColor={COLORS.textLight}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleRegister}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.switchFormButton}
        onPress={() => setActiveTab("login")}
      >
        <Text style={styles.switchFormText}>
          Already have an account? <Text style={styles.switchFormLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderForgotPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Mobile Number or Email</Text>
      <TextInput
        style={styles.input}
        value={forgotPasswordData.contactNumber || forgotPasswordData.email}
        onChangeText={(text) => {
          if (text.includes("@")) {
            setForgotPasswordData({email: text, contactNumber: ""});
          } else {
            setForgotPasswordData({contactNumber: text, email: ""});
          }
        }}
        placeholder="Enter your mobile number or email"
        placeholderTextColor={COLORS.textLight}
      />
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleForgotPassword}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Reset Password</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.switchFormButton}
        onPress={() => setActiveTab("login")}
      >
        <Text style={styles.switchFormText}>
          Back to <Text style={styles.switchFormLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo2.png")}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === "login" && styles.activeTab]}
              onPress={() => setActiveTab("login")}
            >
              <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === "register" && styles.activeTab]}
              onPress={() => setActiveTab("register")}
            >
              <Text style={[styles.tabText, activeTab === "register" && styles.activeTabText]}>
                Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === "forgot" && styles.activeTab]}
              onPress={() => setActiveTab("forgot")}
            >
              <Text style={[styles.tabText, activeTab === "forgot" && styles.activeTabText]}>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "login" && renderLoginForm()}
          {activeTab === "register" && renderRegisterForm()}
          {activeTab === "forgot" && renderForgotPasswordForm()}
        </View>
      </View>
    </ImageBackground>
  );
}

export default ServicePage;