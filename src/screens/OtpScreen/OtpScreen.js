import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
<<<<<<< Updated upstream
=======
  ScrollView,
  Alert,
  Platform,
>>>>>>> Stashed changes
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../utils/toast";
import appTheme from "../../utils/Theme";
import styles from "./OtpStyles";
import userService from "../../services/UserService";

const { COLORS } = appTheme;

function OTP({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
<<<<<<< Updated upstream

  const inputRefs = useRef([]);

  const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Resend timer
=======
  const [resendTimer, setResendTimer] = useState(0);
  const [autoCompleteOtp, setAutoCompleteOtp] = useState("");
  const inputRefs = useRef([]);
  const otpInputRef = useRef(null);

  // -------------------- Effects --------------------
>>>>>>> Stashed changes
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
<<<<<<< Updated upstream
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
=======
      const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
>>>>>>> Stashed changes
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Auto-submit OTP when all digits are filled
  useEffect(() => {
    if (otp.join("").length === 4) {
      handleVerifyOtp();
    }
  }, [otp]);

<<<<<<< Updated upstream
=======
  // Handle auto-complete OTP
  useEffect(() => {
    if (autoCompleteOtp && autoCompleteOtp.length === 6) {
      const otpArray = autoCompleteOtp.split("");
      setOtp(otpArray);
    }
  }, [autoCompleteOtp]);

  // -------------------- Handlers --------------------
>>>>>>> Stashed changes
  const handlePhoneChange = (text) => {
    const cleanedText = text.replace(/\D/g, "");
    if (cleanedText.length <= 10) {
      setPhoneNumber(cleanedText);
      setIsPhoneValid(
        /^[6-9]\d{9}$/.test(cleanedText) || cleanedText.length === 0
      );
    }
  };

<<<<<<< Updated upstream
  const handleSendOtp = async () => {
    if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      showToast(
        "Please enter a valid 10-digit Indian mobile number starting with 6-9."
      );
      return;
=======
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
>>>>>>> Stashed changes
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtp(["", "", "", ""]);
    setLoading(true);
<<<<<<< Updated upstream

    try {
      const smsApiUrl = `https://sms.textspeed.in/vb/apikey.php`;
      const params = new URLSearchParams({
        apikey: "dYU7ULuItj9iZQWM",
        senderid: "BMGJEW",
        templateid: "1707174840853673783",
        number: `91${phoneNumber}`,
        message: `Welcome ${phoneNumber}! Do not share the OTP below with anyone. Your OTP is ${otp} to verify your phone number. This code is valid for 5 minutes.BMG JEWELLERS PRIVATE LIMITED`,
      });

      const fullUrl = `${smsApiUrl}?${params}`;
      const response = await fetch(fullUrl);
      const responseText = await response.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { status: "Error", description: "Invalid response" };
      }

      if (response.ok && result.status === "Success") {
        showToast("OTP sent successfully!");
        await AsyncStorage.setItem("userPhoneNumber", phoneNumber);
        setIsOtpVisible(true);
        setResendTimer(30);
      } else {
        showToast(result.description || "Failed to send OTP.");
      }
    } catch (error) {
      showToast("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
=======
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
>>>>>>> Stashed changes
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.join("") === generatedOtp) {
      try {
        setVerifying(true);
        const storedPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");

<<<<<<< Updated upstream
        const response = await fetch(
          `https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${storedPhoneNumber}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            await AsyncStorage.setItem("userName", data[0].pname || "User");
          }
        }

        await AsyncStorage.setItem("isOtpVerified", "true");
        await AsyncStorage.removeItem("mpin");
        await AsyncStorage.removeItem("isMpinCreated");

        navigation.navigate("MpinScreen", { step: 3 });
      } catch (error) {
        showToast("Failed to save user details.");
      } finally {
        setVerifying(false);
      }
    } else {
      showToast("Invalid OTP. Please try again.");
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg.jpg")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(133, 118, 118, 0.95)", "rgba(0, 0, 0, 0.95)"]}
        style={styles.gradientOverlay}
      >
=======
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
    <ImageBackground source={require("../../assets/bg.jpg")} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
>>>>>>> Stashed changes
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo2.png")}
              style={styles.logoImage}
            />
          </View>

          <LinearGradient
            colors={[COLORS.white, COLORS.card]}
            style={styles.card}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Phone number input */}
            {!isOtpVisible && (
              <>
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
                <Text style={styles.label}>Mobile Number</Text>
                <View
                  style={[
                    styles.inputContainer,
                    !isPhoneValid && styles.inputError,
                  ]}
                >
                  <View style={styles.phoneInputWrapper}>
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
                </View>
                {!isPhoneValid && phoneNumber.length > 0 && (
                  <Text style={styles.errorText}>
                    Please enter a valid mobile number
                  </Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleSendOtp}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={
                      loading
                        ? ["#cccccc", "#bbbbbb"]
                        : [COLORS.primary, COLORS.secondary]
                    }
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Send OTP</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {/* OTP input */}
            {isOtpVisible && (
              <>
                <Text style={styles.label}>Enter OTP</Text>
<<<<<<< Updated upstream
                <Text style={styles.otpSubtitle}>
                  Sent to +91 {phoneNumber}
                </Text>
=======
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
>>>>>>> Stashed changes
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <LinearGradient
                      key={index}
<<<<<<< Updated upstream
                      colors={
                        digit
                          ? [COLORS.primary, COLORS.secondary]
                          : [COLORS.white, COLORS.light]
                      }
=======
                      colors={digit ? [COLORS.primary, COLORS.secondary] : [COLORS.card, COLORS.background]}
>>>>>>> Stashed changes
                      style={styles.otpInputWrapper}
                    >
                      <TextInput
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        textAlign="center"
                        selectionColor={COLORS.primary}
                      />
                    </LinearGradient>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleVerifyOtp}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.primaryButtonText}>Verify OTP</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resendContainer}
<<<<<<< Updated upstream
                  onPress={resendTimer === 0 ? handleSendOtp : null}
                  disabled={resendTimer > 0}
                >
                  <Text style={styles.resendText}>Didn't receive OTP? </Text>
                  <Text
                    style={[
                      styles.resendLink,
                      resendTimer > 0 && styles.resendDisabled,
                    ]}
                  >
=======
                  onPress={handleResendOtp}
                  disabled={resendTimer > 0}
                >
                  <Text style={styles.resendText}>Didn't receive OTP? </Text>
                  <Text style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}>
>>>>>>> Stashed changes
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
<<<<<<< Updated upstream
          </LinearGradient>
=======

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
                    colors={loading ? ["#555", "#444"] : [COLORS.primary, COLORS.secondary]}
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
>>>>>>> Stashed changes
        </View>
      </LinearGradient>
      {verifying && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
<<<<<<< Updated upstream
          <Text style={{ marginTop: 12, color: COLORS.white, fontSize: 16 }}>
            Verifying OTP...
          </Text>
=======
          <Text style={styles.loadingText}>{verifying ? "Verifying OTP..." : "Processing..."}</Text>
>>>>>>> Stashed changes
        </View>
      )}
    </ImageBackground>
  );
}

export default OTP;
