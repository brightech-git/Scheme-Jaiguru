import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../utils/toast";
import appTheme from "../../utils/Theme";
import styles from "./OtpStyles";

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

  const inputRefs = useRef([]);

  const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Resend timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Auto-submit OTP when all digits are filled
  useEffect(() => {
    if (otp.join("").length === 4) {
      handleVerifyOtp();
    }
  }, [otp]);

  const handlePhoneChange = (text) => {
    const cleanedText = text.replace(/\D/g, "");
    if (cleanedText.length <= 10) {
      setPhoneNumber(cleanedText);
      setIsPhoneValid(
        /^[6-9]\d{9}$/.test(cleanedText) || cleanedText.length === 0
      );
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      showToast(
        "Please enter a valid 10-digit Indian mobile number starting with 6-9."
      );
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtp(["", "", "", ""]);
    setLoading(true);

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
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.join("") === generatedOtp) {
      try {
        setVerifying(true);
        const storedPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");

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
                <Text style={styles.otpSubtitle}>
                  Sent to +91 {phoneNumber}
                </Text>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <LinearGradient
                      key={index}
                      colors={
                        digit
                          ? [COLORS.primary, COLORS.secondary]
                          : [COLORS.white, COLORS.light]
                      }
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
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </LinearGradient>
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
          <Text style={{ marginTop: 12, color: COLORS.white, fontSize: 16 }}>
            Verifying OTP...
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}

export default OTP;
