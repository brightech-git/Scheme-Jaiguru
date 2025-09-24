import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES, FONTS } from "../../utils/Theme";

const EmailSupport = ({ navigation }) => {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [focusedInput, setFocusedInput] = useState(null);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Animate on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const fetchUser = async () => {
      try {
        const name = await AsyncStorage.getItem("username");
        const email = await AsyncStorage.getItem("userEmail");
        setUserInfo({ name: name || "", email: email || "" });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFocus = (field) => setFocusedInput(field);
  const handleBlur = () => setFocusedInput(null);

  const validateForm = () => {
    if (!formData.subject.trim()) {
      Alert.alert("Error", "Please enter a subject");
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter your message");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://akj.brightechsoftware.com/api/support/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enquiryType: "scheme",
            subject: formData.subject,
            description: formData.description,
          }),
        }
      );

      const result = await response.text();
      console.log(result);  
      if (response.ok) {
        Alert.alert("Success", `Ticket submitted successfully!\n${result}`, [
          { 
            text: "OK", 
            onPress: () => navigation.goBack(),
            style: "default"
          },
        ]);
        setFormData({ subject: "", description: "" });
      } else {
        Alert.alert("Error", "Failed to submit ticket. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while submitting the ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* <Animated.View 
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        > */}
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>✉️</Text>
            </View>
            <Text style={styles.title}>Contact Support</Text>
            <Text style={styles.subtitle}>
              We're here to help! Share your concerns and we'll respond promptly.
            </Text>

            {/* User Info Badge */}
            {(userInfo.name || userInfo.email) && (
              <View style={styles.userInfoBadge}>
                <View style={styles.userInfoIcon}>
                  <Text style={styles.userInfoIconText}>👤</Text>
                </View>
                <View style={styles.userInfoContent}>
                  {userInfo.name && (
                    <Text style={styles.userInfoText}>{userInfo.name}</Text>
                  )}
                  {userInfo.email && (
                    <Text style={styles.userInfoEmail}>{userInfo.email}</Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Support Request</Text>
              <View style={styles.requiredIndicator}>
                <Text style={styles.requiredText}>* Required fields</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  focusedInput === 'subject' && styles.textInputFocused
                ]}
                value={formData.subject}
                onChangeText={(text) => handleInputChange("subject", text)}
                onFocus={() => handleFocus('subject')}
                onBlur={handleBlur}
                placeholder="Brief summary of your issue"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.messageInput,
                  focusedInput === 'description' && styles.textInputFocused
                ]}
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                onFocus={() => handleFocus('description')}
                onBlur={handleBlur}
                placeholder="Please describe your issue in detail..."
                placeholderTextColor={COLORS.placeholder}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {formData.description.length}/500 characters
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
                (!formData.subject.trim() || !formData.description.trim()) && styles.submitButtonInactive
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || !formData.subject.trim() || !formData.description.trim()}
            >
              <View style={styles.buttonContent}>
                {isSubmitting && <View style={styles.spinner} />}
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.note}>
              Typically responds within 24 hours
            </Text>
          </View>
        {/* </Animated.View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: SIZES.margin * 1.5,
    paddingHorizontal: SIZES.padding,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.margin,
    borderWidth: 2,
    borderColor: COLORS.primary + '20',
  },
  headerIconText: {
    fontSize: 32,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SIZES.padding / 2,
  },
  subtitle: {
    ...FONTS.fontLg,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  userInfoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    marginTop: SIZES.margin,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.padding,
  },
  userInfoIconText: {
    fontSize: 18,
  },
  userInfoContent: {
    flex: 1,
  },
  userInfoText: {
    ...FONTS.h6,
    color: COLORS.text,
    marginBottom: 2,
  },
  userInfoEmail: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
  },
  formContainer: {
    backgroundColor: COLORS.card,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius_lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.margin,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  formTitle: {
    ...FONTS.h4,
    color: COLORS.title,
  },
  requiredIndicator: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SIZES.padding / 2,
    paddingVertical: 4,
    borderRadius: SIZES.radius_sm,
  },
  requiredText: {
    ...FONTS.fontXs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: SIZES.margin * 1.2,
  },
  label: {
    ...FONTS.h6,
    color: COLORS.label,
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 2,
    borderColor: COLORS.outline,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...FONTS.font,
    color: COLORS.text,
    backgroundColor: COLORS.input,
    fontSize: SIZES.font,
    fontFamily: FONTS.font.fontFamily,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageInput: {
    height: 140,
    textAlignVertical: "top",
  },
  charCount: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    textAlign: "right",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: SIZES.margin,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textLight,
    shadowColor: COLORS.shadow,
  },
  submitButtonInactive: {
    backgroundColor: COLORS.outline,
    shadowColor: COLORS.shadow,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRightColor: "transparent",
    marginRight: 8,
  },
  submitButtonText: {
    ...FONTS.h6,
    color: COLORS.white,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  note: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SIZES.padding,
    fontStyle: "italic",
  },
});

export default EmailSupport;