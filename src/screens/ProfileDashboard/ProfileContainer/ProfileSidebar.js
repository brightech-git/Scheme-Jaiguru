import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TextDefault } from "../../../components";
import appTheme from "../../../utils/Theme";
import { StyleSheet } from "react-native";

const { COLORS, SIZES, FONTS } = appTheme;
const { width } = Dimensions.get("window");

const DrawerMenu = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const slideAnim = useState(new Animated.Value(SIZES.width * 0.75))[0];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("userPhoneNumber");
        if (phoneNumber) {
          setUserPhone(phoneNumber);

          const response = await fetch(
            `https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${phoneNumber}`,
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
              setUserName(data[0].pname || "User");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SIZES.width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Logout canceled"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("mpin");
            await AsyncStorage.removeItem("isMpinCreated");
            await AsyncStorage.removeItem("userPhoneNumber");
            onClose();
            navigation.replace("OTP");
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const menuItems = [
    { label: "My Scheme", icon: "list", route: "MyScheme" },
    { label: "Help Center", icon: "help-center", route: "HelpCenter" },
    { label: "Privacy Policy", icon: "privacy-tip", route: "PrivacyPolicy" },
    {
      label: "Terms and Conditions",
      icon: "description",
      route: "TermsandCondition",
    },
    {
      label: "Delete Account",
      icon: "delete",
      route: "DeleteButton",
      iconType: "MaterialIcons",
    },
    {
      label: "About",
      icon: "info",
      route: "AboutPage",
      iconType: "MaterialIcons",
    },
  ];

  const handleMenuItemPress = (route) => {
    onClose();
    navigation.navigate(route);
  };

  const renderIcon = (item) => {
    return (
      <MaterialIcons
        name={item.icon}
        size={SIZES.h3}
        color={COLORS.primary}
      />
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
        >
          <SafeAreaView style={styles.drawerContent}>
            {/* Profile Header */}
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              style={styles.profileHeader}
            >
              <View style={styles.profileIconContainer}>
                <View style={styles.profileCircle}>
                  <MaterialIcons
                    name="account-circle"
                    size={82}
                    color={COLORS.white}
                  />
                </View>
              </View>
              {userName && (
                <TextDefault style={[styles.welcomeText, FONTS.h5]}>
                  Welcome, {userName}
                </TextDefault>
              )}

              <TextDefault style={[styles.phoneText]}>
                {userPhone}
              </TextDefault>
            </LinearGradient>

            {/* Menu Items */}
            <ScrollView
              style={styles.menuContainer}
              showsVerticalScrollIndicator={false}
            >
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <View style={styles.menuItemContent}>
                    <View style={styles.iconContainer}>{renderIcon(item)}</View>
                    <TextDefault style={[styles.menuItemText]}>
                      {item.label}
                    </TextDefault>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Logout Item */}
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={styles.menuItemContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons
                      name="logout"
                      size={SIZES.h3}
                      color={COLORS.danger}
                    />
                  </View>
                  <TextDefault style={[styles.menuItemText]}>
                    Logout
                  </TextDefault>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.shadow + "80", // 50% opacity
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    width: SIZES.width * 0.75,
    backgroundColor: COLORS.card,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  drawerContent: {
    flex: 1,
  },
  profileHeader: {
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  profileIconContainer: {
    marginBottom: SIZES.margin,
  },
  profileCircle: {
    width: SIZES.iconLg * 2,
    height: SIZES.iconLg * 2,
    borderRadius: SIZES.iconLg,
    backgroundColor: COLORS.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  welcomeText: {
    color: COLORS.background,
    marginBottom: SIZES.margin / 2,
  },
  phoneText: {
    color: COLORS.text,
  },
  menuContainer: {
    flex: 1,
    paddingTop: SIZES.padding,
  },
  menuItem: {
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderColor,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: SIZES.icon * 3,
    alignItems: "center",
  },
  menuItemText: {
    color: COLORS.text,
    marginLeft: SIZES.margin,
    ...FONTS.h5,

  },
});

export default DrawerMenu;
