import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../utils/toast";
import appTheme from "../../utils/Theme";
import styles from "./OtpStyles";
import userService from "../../services/UserService";

const { COLORS } = appTheme;

function UserServicePage({ navigation }) {
  const [mode, setMode] = useState("login"); // "login", "register", "otp"
  const [username, setUsername] = useState("");
  const [contactOrEmailOrUsername, setContactOrEmailOrUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [autoCompleteOtp, setAutoCompleteOtp] = useState("");
  const inputRefs = useRef([]);
  const otpInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const inputRefsMap = useRef({});

  // -------------------- Effects --------------------
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (otp.join("").length === 6) handleVerifyOtp();
  }, [otp]);

  // Handle auto-complete OTP
  useEffect(() => {
    if (autoCompleteOtp && autoCompleteOtp.length === 6) {
      const otpArray = autoCompleteOtp.split("");
      setOtp(otpArray);
    }
  }, [autoCompleteOtp]);

  // -------------------- Handlers --------------------
  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
      setIsPhoneValid(/^[6-9]\d{9}$/.test(cleaned) || cleaned.length === 0);
    }
  };

  const handleOtpChange = (val, idx) => {
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < otp.length - 1) inputRefs.current[idx + 1]?.focus();
    else if (!val && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  // Handle auto-complete OTP input
  const handleAutoCompleteOtpChange = (text) => {
    // Remove any non-numeric characters
    const cleanedText = text.replace(/\D/g, "");
    
    if (cleanedText.length <= 6) {
      setAutoCompleteOtp(cleanedText);
      
      // If we have 6 digits, auto-fill the individual OTP inputs
      if (cleanedText.length === 6) {
        const otpArray = cleanedText.split("");
        setOtp(otpArray);
      }
    }
  };

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // -------------------- API Actions --------------------
  const handleRegister = async () => {
    if (!username || !email || !phoneNumber || !password) {
      return showToast("Please fill in all fields");
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return showToast("Enter a valid 10-digit Indian mobile number");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showToast("Enter a valid email address");
    }

    setLoading(true);
    const res = await userService.registerUser({ username, email, contactNumber: phoneNumber, password });

    if (res.success) {
      await AsyncStorage.setItem("tempPhoneNumber", phoneNumber);
      showToast("Registration successful! OTP sent.");
      setMode("otp");
      setResendTimer(30);
      setOtp(["", "", "", "", "", ""]);
      setAutoCompleteOtp(""); // Clear auto-complete input
    } else {
      if (res.error?.toLowerCase().includes("contact number already exists")) {
        Alert.alert(
          "Number Already Registered",
          "This phone number is already registered. Would you like to login instead?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => { setMode("login"); setContactOrEmailOrUsername(phoneNumber); } }
          ]
        );
      } else if (res.error?.toLowerCase().includes("email already exists")) {
        showToast("This email is already registered. Please use another email.");
        setEmail("");
      } else {
        showToast(res.error || "Registration failed");
      }
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setVerifying(true);
    const tempPhoneNumber = await AsyncStorage.getItem("tempPhoneNumber");
    if (!tempPhoneNumber) {
      showToast("Phone number not found. Please try registering again.");
      setVerifying(false);
      return;
    }

    const res = await userService.verifyOtp(tempPhoneNumber, otpValue);

    if (res.success) {
      showToast("OTP verified successfully!");
      setMode("login");
      await AsyncStorage.removeItem("tempPhoneNumber");
      setUsername(""); setEmail(""); setPhoneNumber(""); setPassword("");
      setAutoCompleteOtp(""); // Clear auto-complete input
    } else {
      showToast(res.error || "OTP verification failed");
    }
    setVerifying(false);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    const tempPhoneNumber = await AsyncStorage.getItem("tempPhoneNumber");
    if (!tempPhoneNumber) return showToast("Phone number not found. Please try registering again.");

    // If backend has a resend OTP endpoint, call it. Otherwise, reuse register or verifyOtp API.
    const res = await userService.verifyOtp(tempPhoneNumber, ""); // placeholder if resend API not available
    if (res.success) {
      showToast("OTP resent successfully!");
      setResendTimer(30);
    } else {
      showToast(res.error || "Failed to resend OTP");
    }
  };

  const handleLogin = async () => {
    if (!contactOrEmailOrUsername || !password) return showToast("Please enter email/username and password");

    setLoading(true);
    const res = await userService.loginUser({ contactOrEmailOrUsername, password });

    if (res.success && res.data) {
      const data = res.data;
      await AsyncStorage.setItem("authToken", data.token);
      await AsyncStorage.setItem("userId", String(data.id));
      await AsyncStorage.setItem("userEmail", data.email);
      await AsyncStorage.setItem("username", data.username);
      await AsyncStorage.setItem("userPhoneNumber", data.contact);
      await AsyncStorage.setItem("userData", JSON.stringify(data));

      showToast("Login successful!");
      navigation.navigate("MpinScreen", { step: 3 });
    } else {
      showToast(res.error || "Login failed");
    }
    setLoading(false);
  };

  // -------------------- UI --------------------
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ImageBackground source={require("../../assets/bg.jpg")} style={styles.backgroundImage}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image source={require("../../assets/logo2.png")} style={styles.logoImage} />
              </View>

              <View style={styles.card}>
                <Text style={styles.title}>
                  {mode === "otp" ? "Verify OTP" : mode === "register" ? "Register" : "Login"}
                </Text>
                <Text style={styles.subtitle}>
                  {mode === "otp"
                    ? "Enter the 6-digit OTP sent to your phone"
                    : mode === "register"
                    ? "Create a new account"
                    : "Sign in to continue"}
                </Text>

                {/* Register */}
                {mode === "register" && (
                  <>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                      style={styles.input}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Enter username"
                      placeholderTextColor={COLORS.label}
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter email"
                      placeholderTextColor={COLORS.textLight}
                      keyboardType="email-address"
                    />
                    <Text style={styles.label}>Mobile Number</Text>
                    <View style={[styles.inputContainer, !isPhoneValid && styles.inputError]}>
                      <Text style={styles.countryCode}>+91</Text>
                      <TextInput
                        style={styles.phoneInput}
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={handlePhoneChange}
                        placeholder="Enter 10-digit number"
                        placeholderTextColor={COLORS.textLight}
                        maxLength={10}
                      />
                    </View>
                    {!isPhoneValid && phoneNumber.length > 0 && (
                      <Text style={styles.errorText}>Please enter a valid mobile number</Text>
                    )}
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      placeholderTextColor={COLORS.textLight}
                      secureTextEntry
                    />
                    <TouchableOpacity
                      style={[styles.primaryButton, loading && styles.disabledButton]}
                      onPress={handleRegister}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={loading ? ["#555", "#444"] : [COLORS.gradientcolor1, COLORS.gradientcolor2]}
                        style={styles.buttonGradient}
                      >
                        {loading ? (
                          <ActivityIndicator color={COLORS.black} />
                        ) : (
                          <Text style={styles.primaryButtonText}>Register</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMode("login")}>
                      <Text style={styles.linkText}>Already have an account? Login</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* OTP */}
                {mode === "otp" && (
                  <>
                    <Text style={styles.label}>Enter OTP</Text>
                    <Text style={styles.otpSubtitle}>Sent to +91 {phoneNumber}</Text>
                    
                    {/* Auto-complete OTP Input */}
                    <View style={styles.autoCompleteContainer}>
                      <Text style={styles.autoCompleteLabel}>Auto-complete OTP (from SMS)</Text>
                      <Text style={styles.autoCompleteHint}>
                        This field will automatically detect OTP from SMS messages
                      </Text>
                      <TextInput
                        ref={otpInputRef}
                        style={styles.autoCompleteInput}
                        value={autoCompleteOtp}
                        onChangeText={handleAutoCompleteOtpChange}
                        placeholder="Enter 6-digit OTP"
                        placeholderTextColor={COLORS.textLight}
                        keyboardType="numeric"
                        maxLength={6}
                        autoComplete="sms-otp"
                        textContentType="oneTimeCode"
                        selectionColor={COLORS.primary}
                      />
                    </View>

                    <Text style={styles.orText}>OR</Text>
                    <Text style={styles.manualLabel}>Enter manually</Text>
                    
                    {/* Manual OTP Input */}
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <LinearGradient
                          key={index}
                          colors={digit ? [COLORS.primary, COLORS.secondary] : [COLORS.card, COLORS.background]}
                          style={styles.otpInputWrapper}
                        >
                          <TextInput
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.otpInput}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(val) => handleOtpChange(val, index)}
                            textAlign="center"
                            selectionColor={COLORS.primary}
                          />
                        </LinearGradient>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={[styles.primaryButton, verifying && styles.disabledButton]}
                      onPress={handleVerifyOtp}
                      disabled={verifying}
                    >
                      <LinearGradient
                        colors={verifying ? ["#555", "#444"] : [COLORS.gradientcolor1, COLORS.gradientcolor2]}
                        style={styles.buttonGradient}
                      >
                        {verifying ? (
                          <ActivityIndicator color={COLORS.black} />
                        ) : (
                          <Text style={styles.primaryButtonText}>Verify OTP</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.resendContainer}
                      onPress={handleResendOtp}
                      disabled={resendTimer > 0}
                    >
                      <Text style={styles.resendText}>Didn't receive OTP? </Text>
                      <Text style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}>
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Login */}
                {mode === "login" && (
                  <>
                    <Text style={styles.label}>Email or Phone</Text>
                    <TextInput
                      style={styles.input}
                      value={contactOrEmailOrUsername}
                      onChangeText={setContactOrEmailOrUsername}
                      placeholder="Enter email or phone"
                      placeholderTextColor={COLORS.textLight}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      placeholderTextColor={COLORS.textLight}
                      secureTextEntry
                    />
                    <TouchableOpacity
                      style={[styles.primaryButton, loading && styles.disabledButton]}
                      onPress={handleLogin}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={loading ? ["#555", "#444"] : [COLORS.gradientcolor1, COLORS.gradientcolor2]}
                        style={styles.buttonGradient}
                      >
                        {loading ? (
                          <ActivityIndicator color={COLORS.black} />
                        ) : (
                          <Text style={styles.primaryButtonText}>Login</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMode("register")}>
                      <Text style={styles.linkText}>Don't have an account? Register</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
          {(loading || verifying) && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>{verifying ? "Verifying OTP..." : "Processing..."}</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

export default UserServicePage;