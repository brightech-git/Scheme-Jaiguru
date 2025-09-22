import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Easing,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import appTheme from "../../utils/Theme";
import styles from "./Styles";

const { COLORS, SIZES } = appTheme;
const { width } = Dimensions.get("window");
const SUPPORT_NUMBER = "9600972227";

function HelpCenterPage({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePhoneCall = async (phoneNumber) => {
    try {
      await Linking.openURL(`tel:${phoneNumber}`);
    } catch (error) {
      Alert.alert("Error", "Unable to make a call. Please try again.");
    }
  };

  const handleEmail = async (email) => {
    try {
      await Linking.openURL(`mailto:${email}`);
    } catch (error) {
      Alert.alert("Error", "Unable to open email client. Please try again.");
    }
  };

  const handleOpenMap = async (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to open maps. Please try again.");
    }
  };

  const handleWhatsApp = async (message) => {
    const url = `https://wa.me/91${SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Make sure WhatsApp is installed and try again.");
    }
  };

  const handleOpenYouTube = async () => {
    try {
      await Linking.openURL("https://www.youtube.com/@jaigurujewellers");
    } catch (error) {
      Alert.alert("Error", "Unable to open YouTube. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={COLORS.gradientPrimary1} // Luxury gold to bronze
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={SIZES.h2} color={COLORS.title} />
          </TouchableOpacity>
          <View style={styles.centerContent}>
            <Text style={styles.title}>Help Center</Text>
            <Text style={styles.subtitle}>We're here to assist you</Text>
          </View>
        </LinearGradient>

        <Animated.View
          style={[
            styles.cardsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={COLORS.gradientSecondary} // Soft gold to classic gold
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.phoneIconContainer]}>
                <Icon name="phone" size={SIZES.h4} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>Phone Numbers</Text>
            </View>
            {[
              "+91-9600972227",
              "+91-9884808428",
              "+91-9169161469",
            ].map((number, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={() => handlePhoneCall(number.replace("+91-", ""))}
              >
                <Text style={styles.contactText}>{number}</Text>
                <Icon name="call" size={SIZES.fontLg} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </LinearGradient>

          <LinearGradient
            colors={COLORS.gradientSecondary}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.emailIconContainer]}>
                <Icon name="email" size={SIZES.h4} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>Email Address</Text>
            </View>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleEmail("Contact@JaiGurujewellers.in")}
            >
              <Text style={styles.contactText}>Contact@JaiGurujewellers.in</Text>
              <Icon name="mail-outline" size={SIZES.fontLg} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={COLORS.gradientSecondary}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.locationIconContainer]}>
                <Icon name="location-on" size={SIZES.h4} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>Showroom Addresses</Text>
            </View>
            {[
              {
                name: "Tiruvallur Showroom",
                address: "Jaiguru Jewellers, 712, TNHB, Kakkalur Bypass Road, Tiruvallur - 602001",
              },
              {
                name: "Tiruttani Showroom",
                address: "Jaiguru Jewellers, 321/322 Ma Po Si Salai, Tiruttani",
              },
            ].map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={() => handleOpenMap(location.address)}
              >
                <View style={styles.addressContainer}>
                  <Text style={styles.contactText}>{location.name}</Text>
                  <Text style={styles.contactText}>{location.address}</Text>
                </View>
                <Icon name="place" size={SIZES.fontLg} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </LinearGradient>

          <LinearGradient
            colors={COLORS.gradientSecondary}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primaryLight }]}>
                <Icon name="ondemand-video" size={SIZES.h4} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>YouTube Channel</Text>
            </View>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleOpenYouTube}
            >
              <View style={styles.addressContainer}>
                <Text style={styles.contactText}>Jai Guru Jewellers YouTube</Text>
                <Text style={styles.contactText}>Watch our latest videos</Text>
              </View>
              <Icon name="launch" size={SIZES.fontLg} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <View style={styles.hoursContainer}>
          <Text style={styles.hoursTitle}>Customer Support Hours</Text>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Monday - Saturday</Text>
            <Text style={styles.hoursTime}>10:00 AM - 6:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Sunday</Text>
            <Text style={styles.hoursTime}>11:00 AM - 4:00 PM</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {[
              { name: "Live Chat", action: () => handleWhatsApp("Hello! I need help via Live Chat."), icon: "chat" },
              { name: "FAQs", action: () => handleWhatsApp("I would like to see the FAQs."), icon: "help-outline" },
              { name: "Support", action: () => handlePhoneCall("9600972227"), icon: "description" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={item.action}
              >
                <Icon name={item.icon} size={SIZES.h4} color={COLORS.primary} />
                <Text style={styles.actionText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HelpCenterPage;