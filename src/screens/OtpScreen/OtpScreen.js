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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../utils/toast";
import appTheme from "../../utils/Theme";
import styles from "./OtpStyles";

const { COLORS } = appTheme;
const API_BASE_URL = "https://akj.brightechsoftware.com/api/v1";

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
  const inputRefs = useRef([]);

  // -------------------- API Helper --------------------
  const apiRequest = async (endpoint, method, body, headers = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Something went wrong");
      }
      return data;
    } catch (err) {
      throw new Error(err.message || "Network error");
    }
  };

  // -------------------- Effects --------------------
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (otp.join("").length === 6) handleVerifyOtp();
  }, [otp]);

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
    try {
      const res = await apiRequest("/user/register", "POST", {
        username,
        email,
        contactNumber: phoneNumber,
        password,
      });

      // 🔹 Store basic user info locally
      await AsyncStorage.setItem("userPhoneNumber", phoneNumber);
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("username", username);
      console.log("User registered successfully:", { username, email, phoneNumber });

      showToast("Registration successful! OTP sent.");
      setMode("otp");
      setResendTimer(30);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setVerifying(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ contactNumber: phoneNumber, otp: otpValue }).toString(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Invalid OTP");

      // 🔹 Save OTP verification + phone number
      await AsyncStorage.setItem("isOtpVerified", "true");
      await AsyncStorage.setItem("userPhoneNumber", phoneNumber);

      showToast("OTP verified successfully!");
      setMode("login");
    } catch (err) {
      showToast(err.message);
    } finally {
      setVerifying(false);
    }
  };

const handleLogin = async () => {
  if (!contactOrEmailOrUsername || !password) {
    return showToast("Please enter email/username and password");
  }
  setLoading(true);
  try {
    const data = await apiRequest("/user/login", "POST", {
      contactOrEmailOrUsername,
      password,
    });

    // 🔹 Save token
    await AsyncStorage.setItem("authToken", data.token);

    // 🔹 Save user details
    await AsyncStorage.setItem("userId", String(data.id));
    await AsyncStorage.setItem("userEmail", data.email);
    await AsyncStorage.setItem("username", data.username);
    await AsyncStorage.setItem("userPhoneNumber", data.contact);

    // 🔹 Save full user object too (optional)
    await AsyncStorage.setItem("userData", JSON.stringify(data));

    console.log("user logged in successfully:", data);

    showToast("Login successful!");
    navigation.navigate("MpinScreen", { step: 3 });
  } catch (err) {
    showToast(err.message);
  } finally {
    setLoading(false);
  }
};


  // -------------------- UI --------------------
  return (
    <ImageBackground source={require("../../assets/bg2.jpg")} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  placeholderTextColor={COLORS.textLight}
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
                    colors={loading ? ["#555", "#444"] : [COLORS.primary, COLORS.secondary]}
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
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <LinearGradient
                      key={index}
                      colors={
                        digit ? [COLORS.primary, COLORS.secondary] : [COLORS.card, COLORS.background]
                      }
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
                    colors={verifying ? ["#555", "#444"] : [COLORS.primary, COLORS.secondary]}
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
                  onPress={resendTimer === 0 ? handleRegister : null}
                  disabled={resendTimer > 0}
                >
                  <Text style={styles.resendText}>Didn't receive OTP? </Text>
                  <Text
                    style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Login */}
            {mode === "login" && (
              <>
                <Text style={styles.label}>Email or Username</Text>
                <TextInput
                  style={styles.input}
                  value={contactOrEmailOrUsername}
                  onChangeText={setContactOrEmailOrUsername}
                  placeholder="Enter email or username"
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
        </View>
      </ScrollView>
      {(loading || verifying) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {verifying ? "Verifying OTP..." : "Processing..."}
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}

export default UserServicePage;
