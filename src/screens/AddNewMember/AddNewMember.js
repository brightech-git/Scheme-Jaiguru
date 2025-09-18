import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import appTheme from "../../utils/Theme";
import { BackHeader } from "../../components";

// Destructure theme constants
const { COLORS, SIZES, FONTS, ICONS } = appTheme;
const { width, height } = Dimensions.get("screen");

// Verhoeff Algorithm Tables (unchanged)
const verhoeffMultiplicationTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const verhoeffPermutationTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

// Verhoeff algorithm implementation (unchanged)
const verhoeffValidation = (aadhaarNumber) => {
  try {
    const digits = aadhaarNumber.split("").map(Number).reverse();
    let checksum = 0;

    for (let i = 0; i < digits.length; i++) {
      checksum =
        verhoeffMultiplicationTable[checksum][
          verhoeffPermutationTable[i % 8][digits[i]]
        ];
    }

    return checksum === 0;
  } catch (error) {
    console.error("Error in Verhoeff validation:", error);
    return false;
  }
};

// Validation functions (unchanged)
const validateAadhaar = (aadhaar) => {
  const cleanAadhaar = aadhaar.replace(/[\s-]/g, "");

  if (!cleanAadhaar) {
    return "Aadhaar Number is required";
  }

  const aadhaarRegex = /^\d{12}$/;
  if (!aadhaarRegex.test(cleanAadhaar)) {
    return "Aadhaar should be exactly 12 digits";
  }

  if (/^(\d)\1{11}$/.test(cleanAadhaar)) {
    return "Invalid Aadhaar number (all digits are same)";
  }

  const invalidPatterns = [
    "000000000000",
    "111111111111",
    "222222222222",
    "333333333333",
    "444444444444",
    "555555555555",
    "666666666666",
    "777777777777",
    "888888888888",
    "999999999999",
    "123456789012",
    "012345678901",
  ];

  if (invalidPatterns.includes(cleanAadhaar)) {
    return "Invalid Aadhaar number format";
  }

  if (!verhoeffValidation(cleanAadhaar)) {
    return "Invalid Aadhaar number (checksum validation failed)";
  }

  return "";
};

const validatePAN = (pan) => {
  const cleanPAN = pan.replace(/\s/g, "").toUpperCase();

  if (!cleanPAN) {
    return "PAN Number is required";
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(cleanPAN)) {
    return "Invalid PAN format. Should be like ABCDE1234F";
  }

  const fourthChar = cleanPAN.charAt(3);
  const validEntityCodes = ["P", "F", "C", "H", "A", "T", "B", "L", "J", "G"];
  if (!validEntityCodes.includes(fourthChar)) {
    return "Invalid PAN format. 4th character should be a valid entity code";
  }

  return "";
};

const validateMobile = (mobile) => {
  const cleanMobile = mobile.replace(/\D/g, "");

  if (!cleanMobile) {
    return "Mobile number is required";
  }

  if (cleanMobile.length !== 10) {
    return "Mobile number should be exactly 10 digits";
  }

  if (!/^[6-9]/.test(cleanMobile)) {
    return "Mobile number should start with 6, 7, 8, or 9";
  }

  if (/^(\d)\1{9}$/.test(cleanMobile)) {
    return "Invalid mobile number (all digits are same)";
  }

  return "";
};

const validateEmail = (email) => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return "Email is required";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return "Please enter a valid email address";
  }

  if (cleanEmail.length > 254) {
    return "Email address is too long";
  }

  if (cleanEmail.includes("..")) {
    return "Email address cannot have consecutive dots";
  }

  return "";
};

const validatePincode = (pincode) => {
  const cleanPincode = pincode.replace(/\D/g, "");

  if (!cleanPincode) {
    return "Pincode is required";
  }

  if (cleanPincode.length !== 6) {
    return "Please enter a valid 6-digit pincode";
  }

  if (cleanPincode.startsWith("0")) {
    return "Invalid pincode (cannot start with 0)";
  }

  return "";
};

const validateAge = (dob) => {
  if (!dob) {
    return "Date of Birth is required";
  }

  const today = new Date();
  const birthDate = new Date(dob);

  if (birthDate > today) {
    return "Date of Birth cannot be in the future";
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 18) {
    return "Member must be at least 18 years old";
  }

  if (age > 120) {
    return "Please enter a valid date of birth";
  }

  return "";
};

// Enhanced Date Picker Component
const EnhancedDatePicker = ({
  selectedDate,
  onDateChange,
  placeholder = "Select Date",
  minimumDate,
  maximumDate,
  error,
  label = "Date of Birth",
  required = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(
    selectedDate ? selectedDate.getDate() : ""
  );
  const [selectedMonth, setSelectedMonth] = useState(
    selectedDate ? selectedDate.getMonth() + 1 : ""
  );
  const [selectedYear, setSelectedYear] = useState(
    selectedDate ? selectedDate.getFullYear() : ""
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const formatDate = (date) => {
    if (!date) return placeholder;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ label: day.toString().padStart(2, "0"), value: day });
    }
    return days;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const minYear = minimumDate ? minimumDate.getFullYear() : 1900;
    const years = [];
    for (let year = minYear; year <= currentYear; year++) {
      years.push({ label: year.toString(), value: year });
    }
    return years.reverse();
  };

  const handleConfirm = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
      if (
        date.getDate() === selectedDay &&
        date >= (minimumDate || new Date(1900, 0, 1)) &&
        date <= (maximumDate || new Date())
      ) {
        onDateChange(date);
        setShowPicker(false);
      } else {
        Alert.alert("Invalid Date", "Please select a valid date.");
      }
    } else {
      Alert.alert("Incomplete Date", "Please select day, month, and year.");
    }
  };

  const openDatePicker = () => {
    if (selectedDate) {
      setSelectedDay(selectedDate.getDate());
      setSelectedMonth(selectedDate.getMonth() + 1);
      setSelectedYear(selectedDate.getFullYear());
    } else {
      setSelectedDay("");
      setSelectedMonth("");
      setSelectedYear("");
    }
    setShowPicker(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDatePicker = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowPicker(false));
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
      if (selectedDay && selectedDay > daysInMonth) {
        setSelectedDay("");
      }
    }
  }, [selectedMonth, selectedYear]);

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, FONTS.h6]}>
        {label}{" "}
        {required && (
          <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
        )}
      </Text>

      <TouchableOpacity
        onPress={openDatePicker}
        style={[styles.datePickerButton, error && styles.inputError]}
        activeOpacity={0.7}
      >
        <View style={styles.datePickerContent}>
          <Text
            style={[
              styles.datePickerText,
              !selectedDate
                ? [styles.placeholderText, FONTS.font]
                : [styles.dateText, FONTS.font],
            ]}
          >
            {formatDate(selectedDate) || placeholder}
          </Text>
          <View style={styles.calendarIcon}>
            <Text
              style={[styles.calendarIconText, { color: COLORS.iconPrimary }]}
            >
              📅
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {error && <Text style={[styles.errorText, FONTS.fontSm]}>{error}</Text>}

      <Modal
        transparent={true}
        animationType="none"
        visible={showPicker}
        onRequestClose={closeDatePicker}
      >
        <Animated.View
          style={[
            styles.dateModalOverlay,
            { backgroundColor: COLORS.overlay, opacity: fadeAnim },
          ]}
        >
          <View
            style={[styles.dateModalContent, { backgroundColor: COLORS.card }]}
          >
            <View
              style={[
                styles.dateModalHeader,
                {
                  backgroundColor: COLORS.surface,
                  borderBottomColor: COLORS.borderColor,
                },
              ]}
            >
              <Text style={[styles.dateModalTitle, FONTS.h5]}>
                Select Date of Birth
              </Text>
              <TouchableOpacity
                onPress={closeDatePicker}
                style={[
                  styles.dateModalClose,
                  { backgroundColor: COLORS.primaryLight },
                ]}
              >
                <Text
                  style={[styles.closeButtonText, { color: COLORS.primary }]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.dropdownContainer,
                { backgroundColor: COLORS.surface },
              ]}
            >
              <View style={styles.dropdownSection}>
                <Text style={[styles.dropdownLabel, FONTS.h6]}>Day</Text>
                <CustomPicker
                  selectedValue={selectedDay}
                  onValueChange={(value) => setSelectedDay(value)}
                  items={[
                    { label: "Select Day", value: "" },
                    ...generateDays(),
                  ]}
                  placeholder="Select Day"
                />
              </View>

              <View style={styles.dropdownSection}>
                <Text style={[styles.dropdownLabel, FONTS.h6]}>Month</Text>
                <CustomPicker
                  selectedValue={selectedMonth}
                  onValueChange={(value) => setSelectedMonth(value)}
                  items={[{ label: "Select Month", value: "" }, ...months]}
                  placeholder="Select Month"
                />
              </View>

              <View style={styles.dropdownSection}>
                <Text style={[styles.dropdownLabel, FONTS.h6]}>Year</Text>
                <CustomPicker
                  selectedValue={selectedYear}
                  onValueChange={(value) => setSelectedYear(value)}
                  items={[
                    { label: "Select Year", value: "" },
                    ...generateYears(),
                  ]}
                  placeholder="Select Year"
                />
              </View>
            </View>

            <View
              style={[
                styles.dateModalButtons,
                { backgroundColor: COLORS.surface },
              ]}
            >
              <TouchableOpacity
                onPress={handleConfirm}
                style={[
                  styles.dateModalButton,
                  styles.dateModalConfirmButton,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Text
                  style={[
                    styles.dateModalConfirmText,
                    FONTS.h6,
                    { color: COLORS.white },
                  ]}
                >
                  Confirm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closeDatePicker}
                style={[
                  styles.dateModalButton,
                  styles.dateModalCancelButton,
                  {
                    backgroundColor: COLORS.secondary,
                    borderColor: COLORS.outline,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dateModalCancelText,
                    FONTS.h6,
                    { color: COLORS.white },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

// Custom Picker Component
const CustomPicker = ({
  selectedValue,
  onValueChange,
  items,
  placeholder = "Select an option",
  enabled = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const selected = items.find((item) => item.value === selectedValue);
    setSelectedLabel(selected ? selected.label : placeholder);
  }, [selectedValue, items, placeholder]);

  const handleSelect = (item) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          !enabled && styles.pickerDisabled,
          { backgroundColor: COLORS.input, borderColor: COLORS.borderColor },
        ]}
        onPress={() => enabled && setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.pickerText,
            selectedValue ? FONTS.font : [styles.placeholderText, FONTS.font],
          ]}
        >
          {selectedLabel}
        </Text>
        <View style={styles.pickerIcon}>
          <Text style={[styles.pickerIconText, { color: COLORS.iconPrimary }]}>
            ▼
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: COLORS.overlay }]}
        >
          <View style={[styles.modalContent, { backgroundColor: COLORS.card }]}>
            <View
              style={[
                styles.modalHeader,
                {
                  backgroundColor: COLORS.surface,
                  borderBottomColor: COLORS.borderColor,
                },
              ]}
            >
              <Text style={[styles.modalTitle, FONTS.h5]}>Select Option</Text>
              <TouchableOpacity
                style={[
                  styles.closeButtonContainer,
                  { backgroundColor: COLORS.primaryLight },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.closeButton, { color: COLORS.primary }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { borderBottomColor: COLORS.borderColor },
                    item.value === selectedValue && {
                      backgroundColor: COLORS.primaryLight,
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      FONTS.font,
                      item.value === selectedValue && { color: COLORS.primary },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AddNewMember = () => {
  const scrollViewRef = useRef(null); // Ref for ScrollView
  const inputRefs = useRef({}); // Store refs for input fields
  const [keyboardHeight, setKeyboardHeight] = useState(0); // Track keyboard height
  const [activeInput, setActiveInput] = useState(null); // Track the active input field

  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation();
  const [selectedGroupCodeObj, setSelectedGroupCodeObj] = useState(null);
  const [selectedCurrentRegNoObj, setSelectedCurrentRegNoObj] = useState(null);
  const [namePrefix, setNamePrefix] = useState("Mr");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [doorNo, setDoorNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [country, setCountry] = useState("India");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [amount, setAmount] = useState("");
  const [accCode, setAccCode] = useState("");
  const [modePay, setModepay] = useState("C");
  const [dob, setDob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [goldRate, setGoldRate] = useState(null);
  const [loadingGoldRate, setLoadingGoldRate] = useState(false);
  const [goldRateError, setGoldRateError] = useState(false);
  const [calculatedWeight, setCalculatedWeight] = useState("");

  const API_BASE_URL = "https://akj.brightechsoftware.com";

  // Handle keyboard show/hide events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      if (activeInput && inputRefs.current[activeInput]) {
        inputRefs.current[activeInput].measureLayout(
          scrollViewRef.current.getScrollableNode(),
          (x, y) => {
            scrollViewRef.current.scrollTo({
              y: y + 20, // Add some padding above the input
              animated: true,
            });
          },
          () => console.log('Error measuring input layout')
        );
      }
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setActiveInput(null);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [activeInput]);

  const handleBack = () => {
    navigation.navigate("MainLanding");
  };

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
  ];

  const getDefaultInitial = (firstName) => {
    if (!firstName || firstName.trim().length === 0) return "";
    return firstName.trim().charAt(0).toUpperCase();
  };

  const route = useRoute();
  const { schemeId } = route.params || {};

  useEffect(() => {
    if (schemeId) {
      setSelectedSchemeId(schemeId);
    }
  }, [schemeId]);

  const fetchGoldRate = async () => {
    setLoadingGoldRate(true);
    setGoldRateError(false);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/v1/api/account/todayrate`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch gold rate`);
      }

      const data = await response.json();

      if (!data.Rate || isNaN(data.Rate)) {
        throw new Error("Invalid gold rate received from server");
      }

      setGoldRate(data.Rate);
    } catch (error) {
      console.error("Error fetching gold rate:", error);
      setGoldRateError(true);
      setGoldRate(null);

      if (error.name !== "AbortError") {
        Alert.alert(
          "Error",
          "Failed to fetch current gold rate. Please check your internet connection and try again.",
          [
            { text: "Retry", onPress: fetchGoldRate },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } finally {
      setLoadingGoldRate(false);
    }
  };

  useEffect(() => {
    if (
      currentStep === 2 &&
      selectedSchemeId === 7 &&
      goldRate === null &&
      !loadingGoldRate &&
      !goldRateError
    ) {
      fetchGoldRate();
    }
  }, [currentStep, selectedSchemeId, goldRate, loadingGoldRate, goldRateError]);

  const convertAmountToWeight = useCallback(
    (amountValue) => {
      if (
        goldRate &&
        amountValue &&
        !isNaN(amountValue) &&
        parseFloat(amountValue) > 0
      ) {
        const weightInGrams = (parseFloat(amountValue) / goldRate).toFixed(3);
        setCalculatedWeight(weightInGrams);
      } else {
        setCalculatedWeight("");
      }
    },
    [goldRate]
  );

  const handleDigiGoldAmountChange = (text) => {
    const sanitizedText = text.replace(/[^0-9.]/g, "");

    const parts = sanitizedText.split(".");
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) {
      return;
    }

    setAmount(sanitizedText);
    convertAmountToWeight(sanitizedText);

    if (validationErrors.amount) {
      setValidationErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  useEffect(() => {
    const fetchCitiesForPincode = async () => {
      if (pincode && pincode.length === 6) {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          if (response.ok) {
            const data = await response.json();

            if (data && data[0]?.Status === "Success" && data[0]?.PostOffice) {
              const postOffices = data[0].PostOffice;

              const cityList = [...new Set(postOffices.map((po) => po.Name))];
              setCities(cityList);

              const stateName = postOffices[0].State;
              setSelectedState(stateName);

              if (city && !cityList.includes(city)) {
                setCity("");
              }
            } else {
              setCities([]);
              setCity("");
              setSelectedState("");
              setValidationErrors((prev) => ({
                ...prev,
                pincode: "No cities found for this pincode.",
              }));
            }
          } else {
            setCities([]);
            setCity("");
            setSelectedState("");
            setValidationErrors((prev) => ({
              ...prev,
              pincode: "Failed to fetch pincode data.",
            }));
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
          setCities([]);
          setCity("");
          setSelectedState("");
          setValidationErrors((prev) => ({
            ...prev,
            pincode: "Error fetching pincode data.",
          }));
        }
      } else {
        setCities([]);
        setCity("");
        setSelectedState("");
      }
    };

    fetchCitiesForPincode();
  }, [pincode]);

  const validateStep1 = () => {
    const errors = {};

    if (!name.trim()) errors.name = "First Name is required";
    if (!surname.trim()) errors.surname = "Surname is required";
    if (!doorNo.trim()) errors.doorNo = "Door No is required";
    if (!address1.trim()) errors.address1 = "Address 1 is required";
    if (!area.trim()) errors.area = "Area is required";
    if (!selectedState) errors.selectedState = "State is required";
    if (!country.trim()) errors.country = "Country is required";
    if (!dob) errors.dob = "Date of Birth is required";

    const pincodeError = validatePincode(pincode);
    if (pincodeError) {
      errors.pincode = pincodeError;
    } else if (pincode && cities.length === 0) {
      errors.pincode = "Please enter a valid pincode (no cities found)";
    }

    if (!city.trim()) {
      errors.city = "City is required";
    } else if (pincode && cities.length > 0 && !cities.includes(city)) {
      errors.city = "Please select a valid city for this pincode";
    }

    const mobileError = validateMobile(mobile);
    if (mobileError) errors.mobile = mobileError;

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const panError = validatePAN(panNumber);
    if (panError) errors.panNumber = panError;

    const aadhaarError = validateAadhaar(aadharNumber);
    if (aadhaarError) errors.aadharNumber = aadhaarError;

    if (country !== "India") errors.country = "Country should be India";

    const ageError = validateAge(dob);
    if (ageError) errors.dob = ageError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!selectedSchemeId) errors.scheme = "Please select a scheme";

    if (selectedSchemeId === 7) {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        errors.amount = "Please enter a valid amount greater than 0";
      } else if (parseFloat(amount) < 1) {
        errors.amount = "Minimum payment amount is ₹1";
      }
      if (!goldRate) {
        errors.goldRate =
          "Current gold rate is not available. Please retry fetching.";
      }
      if (!calculatedWeight || parseFloat(calculatedWeight) <= 0) {
        errors.calculatedWeight = "Calculated gold weight is invalid.";
      }
    } else {
      if (!amount) errors.amount = "Please select an amount";
    }

    if (!accCode) errors.accCode = "Please select a payment mode";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/api/member/scheme`);
        const data = await response.json();
        const formattedSchemes = data.map((s) => ({
          id: s.SchemeId,
          name: s.schemeName,
          description: s.SchemeSName,
        }));
        setSchemes(formattedSchemes);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    fetchSchemes();
  }, []);

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/v1/api/account/getTranType`
        );
        if (!response.ok) throw new Error("Network response was not ok.");
        const data = await response.json();
        setTransactionTypes(data);
      } catch (error) {
        console.error("Error fetching transaction types:", error);
      }
    };
    fetchTransactionTypes();
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateStep2()) {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields correctly in Scheme Details."
      );
      return;
    }

    setIsSubmitting(true);

    console.log("---- SUBMIT STARTED ----");

    const newMember = {
      title: namePrefix,
      initial: getDefaultInitial(name),
      pName: name,
      sName: surname,
      doorNo,
      address1,
      address2,
      area,
      city,
      state: selectedState,
      country,
      pinCode: pincode,
      mobile,
      idProof: "Aadhaar",
      idProofNo: aadharNumber,
      panNumber: panNumber,
      dob: dob ? dob.toISOString().split("T")[0] : "",
      email,
      upDateTime: new Date().toISOString().slice(0, 19).replace("T", " "),
      userId: "999",
      appVer: "19.12.10.1",
    };
    console.log("newMember:", newMember);

    let createSchemeSummary;
    if (selectedSchemeId === 7) {
      createSchemeSummary = {
        schemeId: selectedSchemeId,
        groupCode: "DGA",
        regNo: (Math.random() * 100000).toFixed(0),
        joinDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        upDateTime2: new Date().toISOString().slice(0, 19).replace("T", " "),
        openingDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        userId2: "9999",
        goldWeightGram: parseFloat(calculatedWeight),
      };
    } else {
      createSchemeSummary = {
        schemeId: selectedSchemeId,
        groupCode: selectedGroupCodeObj,
        regNo: selectedCurrentRegNoObj,
        joinDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        upDateTime2: new Date().toISOString().slice(0, 19).replace("T", " "),
        openingDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        userId2: "9999",
      };
    }
    console.log("createSchemeSummary:", createSchemeSummary);

    const schemeCollectInsert = {
      amount: parseFloat(amount),
      modePay,
      accCode,
    };
    console.log("schemeCollectInsert:", schemeCollectInsert);

    const requestBody = {
      newMember,
      createSchemeSummary,
      schemeCollectInsert,
    };
    console.log("Final Request Body:", JSON.stringify(requestBody, null, 2));

    try {
      console.log(
        "Sending request to:",
        `${API_BASE_URL}/v1/api/member/create`
      );
      const response = await fetch(`${API_BASE_URL}/v1/api/member/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
          console.log("Error Response Data:", errorData);
        } catch (e) {
          console.log("Error parsing response JSON:", e);
        }
        throw new Error(
          "Error creating member: " + (errorData.message || response.statusText)
        );
      }

      const responseData = await response.text();
      console.log("Success Response Data:", responseData);

      Alert.alert("Success", "Member added successfully!", [
        { text: "OK", onPress: () => navigation.navigate("MainLanding") },
      ]);
      resetFormFields();
    } catch (error) {
      console.error("Error during member creation:", error);
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      console.log("---- SUBMIT ENDED ----");
      setIsSubmitting(false);
    }
  };

  const resetFormFields = () => {
    setSelectedGroupCodeObj(null);
    setSelectedCurrentRegNoObj(null);
    setName("");
    setSurname("");
    setDoorNo("");
    setAddress1("");
    setAddress2("");
    setArea("");
    setCity("");
    setSelectedState("");
    setCountry("India");
    setPincode("");
    setMobile("");
    setDob(null);
    setEmail("");
    setPanNumber("");
    setAadharNumber("");
    setAmounts([]);
    setAmount("");
    setAccCode("");
    setModepay("C");
    setSelectedSchemeId(null);
    setValidationErrors({});
    setGoldRate(null);
    setLoadingGoldRate(false);
    setGoldRateError(false);
    setCalculatedWeight("");
  };

  useEffect(() => {
    if (schemes.length > 0 && selectedSchemeId === null) {
      setSelectedSchemeId(schemes[0].id);
    }
  }, [schemes, selectedSchemeId]);

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields correctly in Member Details."
      );
    }
  };

  const handleMobileChange = (text) => {
    const cleanedText = text.replace(/\D/g, "");
    if (cleanedText.length <= 10) {
      setMobile(cleanedText);

      if (validationErrors.mobile) {
        setValidationErrors((prev) => ({ ...prev, mobile: "" }));
      }
    }
  };

  const handleAadhaarChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAadharNumber(numericValue);

    if (validationErrors.aadharNumber) {
      setValidationErrors((prev) => ({ ...prev, aadharNumber: "" }));
    }
  };

  const handlePANChange = (text) => {
    const upperText = text.toUpperCase();
    setPanNumber(upperText);

    if (validationErrors.panNumber) {
      setValidationErrors((prev) => ({ ...prev, panNumber: "" }));
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);

    if (validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePincodeChange = (text) => {
    const numericValue = text.replace(/\D/g, "");
    setPincode(numericValue);

    if (validationErrors.pincode) {
      setValidationErrors((prev) => ({ ...prev, pincode: "" }));
    }
  };

  const handleDateChange = (selectedDate) => {
    setDob(selectedDate);

    if (validationErrors.dob) {
      setValidationErrors((prev) => ({ ...prev, dob: "" }));
    }
  };

  const renderCityInput = () => {
    if (cities.length > 0) {
      return (
        <View
          style={[
            styles.inputContainer,
            validationErrors.city && styles.inputError,
          ]}
        >
          <Text style={[styles.label, FONTS.h6]}>
            City{" "}
            <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
          </Text>
          <CustomPicker
            selectedValue={city}
            onValueChange={(value) => {
              setCity(value);
              if (validationErrors.city) {
                setValidationErrors((prev) => ({ ...prev, city: "" }));
              }
            }}
            items={[
              { label: "Select a City", value: "" },
              ...cities.map((cityName) => ({
                label: cityName,
                value: cityName,
              })),
            ]}
            placeholder="Select a City"
          />
          {validationErrors.city && (
            <Text style={[styles.errorText, FONTS.fontSm]}>
              {validationErrors.city}
            </Text>
          )}
        </View>
      );
    }

    return (
      <View
        style={[
          styles.inputContainer,
          validationErrors.city && styles.inputError,
        ]}
      >
        <Text style={[styles.label, FONTS.h6]}>
          City{" "}
          <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: COLORS.input, borderColor: COLORS.borderColor },
          ]}
          onChangeText={(text) => {
            setCity(text);
            if (validationErrors.city) {
              setValidationErrors((prev) => ({ ...prev, city: "" }));
            }
          }}
          value={city}
          placeholder="Enter City"
          placeholderTextColor={COLORS.placeholder}
          editable={cities.length === 0}
        />
        {validationErrors.city && (
          <Text style={[styles.errorText, FONTS.fontSm]}>
            {validationErrors.city}
          </Text>
        )}
      </View>
    );
  };

const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={[styles.card, { backgroundColor: COLORS.card }]}>
            <BackHeader
              title="Member Details"
              backPressed={() => navigation.goBack()}
              style={[styles.header, { backgroundColor: COLORS.surface }]}
            />

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                First Name <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.name && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => {
                  setName(text);
                  if (validationErrors.name) {
                    setValidationErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                value={name}
                placeholder="Enter First Name"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('name')}
                ref={(ref) => (inputRefs.current['name'] = ref)}
              />
              {validationErrors.name && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Surname <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.surname && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => {
                  setSurname(text);
                  if (validationErrors.surname) {
                    setValidationErrors((prev) => ({ ...prev, surname: '' }));
                  }
                }}
                value={surname}
                placeholder="Enter Surname"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('surname')}
                ref={(ref) => (inputRefs.current['surname'] = ref)}
              />
              {validationErrors.surname && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.surname}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Door No <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.doorNo && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => {
                  setDoorNo(text);
                  if (validationErrors.doorNo) {
                    setValidationErrors((prev) => ({ ...prev, doorNo: '' }));
                  }
                }}
                value={doorNo}
                placeholder="Enter Door No"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('doorNo')}
                ref={(ref) => (inputRefs.current['doorNo'] = ref)}
              />
              {validationErrors.doorNo && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.doorNo}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Address 1 <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.address1 && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => {
                  setAddress1(text);
                  if (validationErrors.address1) {
                    setValidationErrors((prev) => ({ ...prev, address1: '' }));
                  }
                }}
                value={address1}
                placeholder="Enter Address 1"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('address1')}
                ref={(ref) => (inputRefs.current['address1'] = ref)}
              />
              {validationErrors.address1 && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.address1}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>Address 2</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={setAddress2}
                value={address2}
                placeholder="Enter Address 2"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('address2')}
                ref={(ref) => (inputRefs.current['address2'] = ref)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Area <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.area && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => {
                  setArea(text);
                  if (validationErrors.area) {
                    setValidationErrors((prev) => ({ ...prev, area: '' }));
                  }
                }}
                value={area}
                placeholder="Enter Area"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('area')}
                ref={(ref) => (inputRefs.current['area'] = ref)}
              />
              {validationErrors.area && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.area}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Pincode <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.pincode && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={handlePincodeChange}
                value={pincode}
                placeholder="Enter Pincode"
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('pincode')}
                ref={(ref) => (inputRefs.current['pincode'] = ref)}
              />
              {validationErrors.pincode && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.pincode}</Text>}
              {cities.length > 0 && <Text style={[styles.hintText, FONTS.fontXs]}>Available cities: {cities.join(', ')}</Text>}
            </View>

            {renderCityInput()}

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                State <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={selectedState}
                onValueChange={(itemValue) => {
                  setSelectedState(itemValue);
                  if (validationErrors.selectedState) {
                    setValidationErrors((prev) => ({ ...prev, selectedState: '' }));
                  }
                }}
                items={[{ label: 'Select a State', value: '' }, ...states.map((state) => ({ label: state, value: state }))]}
                placeholder="Select a State"
              />
              {validationErrors.selectedState && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.selectedState}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Country <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.country && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => {
                  setCountry(text);
                  if (validationErrors.country) {
                    setValidationErrors((prev) => ({ ...prev, country: '' }));
                  }
                }}
                value={country}
                placeholder="Enter Country"
                placeholderTextColor={COLORS.placeholder}
                editable={false}
                onFocus={() => setActiveInput('country')}
                ref={(ref) => (inputRefs.current['country'] = ref)}
              />
              {validationErrors.country && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.country}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Mobile Number <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <View
                style={[styles.mobileInputContainer, validationErrors.mobile && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
              >
                <Text style={[styles.countryCode, FONTS.h6, { color: COLORS.primary }]}>+91</Text>
                <TextInput
                  style={[styles.input, styles.mobileInput, { backgroundColor: COLORS.input }]}
                  onChangeText={handleMobileChange}
                  value={mobile}
                  placeholder="Enter 10-digit Mobile Number"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor={COLORS.placeholder}
                  onFocus={() => setActiveInput('mobile')}
                  ref={(ref) => (inputRefs.current['mobile'] = ref)}
                />
              </View>
              {validationErrors.mobile && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.mobile}</Text>}
            </View>

            <EnhancedDatePicker
              selectedDate={dob}
              onDateChange={handleDateChange}
              placeholder="Select Date of Birth"
              minimumDate={new Date(1900, 0, 1)}
              maximumDate={new Date()}
              error={validationErrors.dob}
              label="Date of Birth"
              required={true}
            />

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Email <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.email && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={handleEmailChange}
                value={email}
                placeholder="Enter Email"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setActiveInput('email')}
                ref={(ref) => (inputRefs.current['email'] = ref)}
              />
              {validationErrors.email && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                PAN Number <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.panNumber && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={handlePANChange}
                value={panNumber}
                placeholder="Enter PAN Number (e.g., ABCDE1234F)"
                maxLength={10}
                autoCapitalize="characters"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('panNumber')}
                ref={(ref) => (inputRefs.current['panNumber'] = ref)}
              />
              {validationErrors.panNumber && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.panNumber}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Aadhaar Number <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.aadharNumber && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={handleAadhaarChange}
                value={aadharNumber}
                placeholder="Enter 12-digit Aadhaar Number"
                keyboardType="numeric"
                maxLength={12}
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput('aadharNumber')}
                ref={(ref) => (inputRefs.current['aadharNumber'] = ref)}
              />
              {validationErrors.aadharNumber && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.aadharNumber}</Text>}
            </View>

            <View style={[styles.buttonRow, { gap: SIZES.margin }]}>
              <TouchableOpacity
                style={[styles.button, styles.backButton, { backgroundColor: COLORS.secondary, borderColor: COLORS.outline }]}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, FONTS.h6, { color: COLORS.white }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.nextButton, { backgroundColor: COLORS.primary }]}
                onPress={handleNextStep}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, FONTS.h6, { color: COLORS.white }]}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        const isDigiGold = selectedSchemeId === 7;
        const selectedScheme = schemes.find((s) => s.id === selectedSchemeId);
        const schemeName = selectedScheme ? selectedScheme.name : 'No Scheme Selected';

        return (
          <View style={[styles.card, { backgroundColor: COLORS.card }]}>
            <BackHeader
              title="Scheme Details"
              backPressed={() => setCurrentStep(1)}
              style={[styles.header, { backgroundColor: COLORS.surface }]}
            />

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Scheme Selection <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <View style={[styles.schemeDisplay, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}>
                <Text style={[styles.schemeText, FONTS.font]}>{schemeName}</Text>
              </View>
              {validationErrors.scheme && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.scheme}</Text>}
            </View>

            {isDigiGold ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, FONTS.h6]}>
                    Amount (₹) <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, validationErrors.amount && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                    keyboardType="decimal-pad"
                    value={amount}
                    editable={!isSubmitting}
                    onChangeText={handleDigiGoldAmountChange}
                    placeholder="Enter amount for DigiGold"
                    placeholderTextColor={COLORS.placeholder}
                    maxLength={10}
                    onFocus={() => setActiveInput('amount')}
                    ref={(ref) => (inputRefs.current['amount'] = ref)}
                  />
                  {validationErrors.amount && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.amount}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, FONTS.h6]}>Current Gold Rate</Text>
                  {loadingGoldRate ? (
                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SIZES.margin }} />
                  ) : goldRateError ? (
                    <TouchableOpacity
                      style={[styles.retryButton, { backgroundColor: COLORS.primaryLight, borderColor: COLORS.danger }]}
                      onPress={fetchGoldRate}
                      disabled={isSubmitting}
                    >
                      <Text style={[styles.retryText, FONTS.fontSm, { color: COLORS.danger }]}>Failed to load rate. Tap to retry</Text>
                    </TouchableOpacity>
                  ) : goldRate ? (
                    <Text style={[styles.staticValueText, FONTS.font, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}>
                      {`₹${goldRate} / gm (22K)`}
                    </Text>
                  ) : (
                    <Text style={[styles.staticValueText, FONTS.font, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}>N/A</Text>
                  )}
                  {validationErrors.goldRate && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.goldRate}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, FONTS.h6]}>Calculated Gold Weight (grams)</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput, validationErrors.calculatedWeight && styles.inputError, { backgroundColor: COLORS.darkInput, borderColor: COLORS.borderColor }]}
                    value={calculatedWeight ? `${calculatedWeight} g` : ''}
                    editable={false}
                    placeholder="Weight will be calculated"
                    placeholderTextColor={COLORS.placeholder}
                  />
                  {validationErrors.calculatedWeight && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.calculatedWeight}</Text>}
                  {amount && calculatedWeight && parseFloat(calculatedWeight) > 0 && (
                    <Text style={[styles.hintText, FONTS.fontXs]}>You will purchase {calculatedWeight}g of 22K gold.</Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, FONTS.h6]}>
                    Amount <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
                  </Text>
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SIZES.margin }} />
                  ) : amounts.length > 0 ? (
                    <CustomPicker
                      selectedValue={amount}
                      onValueChange={(itemValue) => {
                        const selectedAmount = amounts.find((amt) => amt.value === itemValue);
                        setAmount(itemValue);
                        if (selectedAmount) {
                          setSelectedGroupCodeObj(selectedAmount.groupCode);
                          setSelectedCurrentRegNoObj(selectedAmount.currentRegNo);
                        }
                        if (validationErrors.amount) {
                          setValidationErrors((prev) => ({ ...prev, amount: '' }));
                        }
                      }}
                      items={[{ label: 'Select an Amount', value: '' }, ...amounts.map((amt) => ({ label: `₹${amt.value} (${amt.groupCode})`, value: amt.value }))]}
                      placeholder="Select Amount"
                      enabled={!isSubmitting}
                    />
                  ) : (
                    <Text style={[styles.noDataText, FONTS.fontXs]}>No amounts available for this scheme.</Text>
                  )}
                  {validationErrors.amount && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.amount}</Text>}
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Payment Mode <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={accCode}
                onValueChange={(itemValue) => {
                  setAccCode(itemValue);
                  const selectedType = transactionTypes.find((type) => type.ACCOUNT === itemValue);
                  if (selectedType?.CARDTYPE) {
                    setModepay(selectedType.CARDTYPE);
                  }
                  if (validationErrors.accCode) {
                    setValidationErrors((prev) => ({ ...prev, accCode: '' }));
                  }
                }}
                items={[{ label: 'Select Payment Mode', value: '' }, ...transactionTypes.map((type) => ({ label: type.NAME, value: type.ACCOUNT }))]}
                placeholder="Select Payment Mode"
                enabled={!isSubmitting}
              />
              {validationErrors.accCode && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.accCode}</Text>}
            </View>

            <View style={[styles.buttonRow, { gap: SIZES.margin }]}>
              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled, { backgroundColor: COLORS.primary }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={COLORS.white} />
                    <Text style={[styles.buttonText, styles.loadingText, FONTS.h6, { color: COLORS.white }]}>Submitting...</Text>
                  </View>
                ) : (
                  <Text style={[styles.buttonText, FONTS.h6, { color: COLORS.white }]}>Submit</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.backButton, isSubmitting && styles.buttonDisabled, { backgroundColor: COLORS.secondary, borderColor: COLORS.outline }]}
                onPress={() => setCurrentStep(1)}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, FONTS.h6, { color: COLORS.white }]}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({
        ios: 60, // Adjust based on your header height
        android: 80, // Adjust for Android
      })}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardHeight - 250 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  inputContainer: {
    marginBottom: SIZES.margin * 1,
  },
  label: {
    ...FONTS.h6,
    color: COLORS.label,
    marginBottom: SIZES.margin / 2,
    letterSpacing: 0.3,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    ...FONTS.h6,
    color: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  inputError: {
    borderColor: COLORS.danger,
    borderWidth: 2,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  pickerText: {
    ...FONTS.font,
    color: COLORS.text,
    flex: 1,
  },
  placeholderText: {
    ...FONTS.font,
    color: COLORS.placeholder,
  },
  pickerIcon: {
    marginLeft: SIZES.margin,
  },
  pickerIconText: {
    fontSize: SIZES.fontLg,
    color: COLORS.iconPrimary,
  },
  pickerDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.darkInput,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    width: '92%',
    maxHeight: '85%',
    elevation: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: COLORS.surface,
  },
  modalTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    letterSpacing: 0.3,
  },
  closeButtonContainer: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
  },
  closeButton: {
    fontSize: SIZES.h5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  modalItem: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  selectedModalItem: {
    backgroundColor: COLORS.primaryLight,
  },
  modalItemText: {
    ...FONTS.font,
    color: COLORS.text,
  },
  selectedModalItemText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.margin,
    gap: SIZES.margin,
    marginBottom: SIZES.margin * 2, // Reduced to avoid excessive padding
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  backButton: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1.5,
    borderColor: COLORS.outline,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    ...FONTS.h6,
    color: COLORS.white,
  },
  buttonDisabled: {
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: SIZES.margin,
  },
  asterisk: {
    color: COLORS.danger,
    fontSize: SIZES.fontLg,
    fontWeight: '700',
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    paddingHorizontal: SIZES.padding,
    height: 56,
  },
  countryCode: {
    ...FONTS.h6,
    color: COLORS.primary,
    marginRight: SIZES.margin,
  },
  mobileInput: {
    flex: 1,
    borderWidth: 0,
    height: '100%',
  },
  errorText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
    marginTop: 6,
    marginLeft: 6,
  },
  dateText: {
    ...FONTS.font,
    color: COLORS.text,
  },
  schemeDisplay: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  schemeText: {
    ...FONTS.font,
    color: COLORS.text,
  },
  hintText: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  datePickerButton: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    ...FONTS.font,
    flex: 1,
    alignSelf: 'center',
    color: COLORS.text,
  },
  calendarIcon: {
    marginLeft: SIZES.margin,
  },
  calendarIconText: {
    fontSize: SIZES.h5,
    color: COLORS.iconPrimary,
  },
  dateModalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateModalContent: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    width: '95%',
    maxWidth: SIZES.container,
    elevation: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  dateModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: COLORS.surface,
  },
  dateModalTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    letterSpacing: 0.3,
  },
  dateModalClose: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
  },
  closeButtonText: {
    fontSize: SIZES.h5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding,
    backgroundColor: COLORS.surface,
  },
  dropdownSection: {
    marginBottom: SIZES.margin,
  },
  dropdownLabel: {
    ...FONTS.h6,
    color: COLORS.label,
    marginBottom: SIZES.margin / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    paddingTop: SIZES.padding,
    gap: SIZES.margin,
    backgroundColor: COLORS.surface,
  },
  dateModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  dateModalCancelButton: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1.5,
    borderColor: COLORS.outline,
  },
  dateModalConfirmButton: {
    backgroundColor: COLORS.primary,
  },
  dateModalCancelText: {
    ...FONTS.h6,
    color: COLORS.white,
  },
  dateModalConfirmText: {
    ...FONTS.h6,
    color: COLORS.white,
  },
  disabledInput: {
    backgroundColor: COLORS.darkInput,
    color: COLORS.textLight,
    opacity: 0.7,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  staticValueText: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    ...FONTS.font,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 18,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius_sm,
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    marginTop: SIZES.margin,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  retryText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
  },
  noDataText: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    marginTop: SIZES.margin,
    fontStyle: 'italic',
  },
});

export default AddNewMember;
