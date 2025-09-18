import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Dimensions,
  Animated,
  Easing,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './MpinStyles';

// Toast function for iOS
const showToast = (message) => {
  console.log(`Toast shown: ${message}`);
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
};

function MpinScreen({ route, navigation }) {
  console.log('MpinScreen component rendered');
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    console.log('MpinScreen useEffect triggered - checking if MPIN already created');
    checkIfMpinCreated();
    animateIn();
  }, []);

  const animateIn = () => {
    console.log('Starting animation in MpinScreen');
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
      })
    ]).start(() => {
      console.log('Animation completed in MpinScreen');
    });
  };

  const checkIfMpinCreated = async () => {
    console.log('Checking if MPIN is already created');
    try {
      const isMpinCreated = await AsyncStorage.getItem('isMpinCreated');
      console.log(`isMpinCreated value from storage: ${isMpinCreated}`);
      if (isMpinCreated === 'true') {
        console.log('MPIN already exists, navigating to VerifyMpin screen');
        navigation.replace('VerifyMpin');
      } else {
        console.log('No MPIN found, staying on Create MPIN screen');
      }
    } catch (error) {
      console.error('Error checking MPIN creation:', error);
    }
  };

  const handleMpinChange = (value, index) => {
    console.log(`MPIN input changed at index ${index}, value: ${value}`);
    if (value && !/^\d$/.test(value)) {
      console.log('Invalid input: not a digit, ignoring');
      return;
    }
    
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);
    console.log(`Updated MPIN array: [${newMpin}]`);

    if (value && index < 3) {
      console.log(`Moving focus to next input at index ${index + 1}`);
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      console.log(`Moving focus to previous input at index ${index - 1}`);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    console.log(`Key pressed: ${event.nativeEvent.key} at index ${index}`);
    if (event.nativeEvent.key === 'Backspace' && !mpin[index] && index > 0) {
      console.log('Backspace pressed on empty field, moving to previous input');
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCreateMpin = async () => {
    console.log('Create MPIN button pressed');
    const enteredMpin = mpin.join('');
    console.log(`Entered MPIN: ${enteredMpin}`);

    if (enteredMpin.length !== 4) {
      console.log('Invalid MPIN length, showing error');
      showToast('Please enter a valid 4-digit MPIN.');
      return;
    }

    console.log('MPIN is valid, proceeding to save');
    setIsLoading(true);
    try {
      console.log('Saving MPIN to AsyncStorage');
      await AsyncStorage.setItem('mpin', enteredMpin);
      await AsyncStorage.setItem('isMpinCreated', 'true');
      console.log('MPIN saved successfully');
      showToast('MPIN created successfully!');
      setTimeout(() => {
        console.log('Navigating to Drawer screen');
        navigation.replace('Drawer');
      }, 1000);
    } catch (error) {
      console.error('Failed to save MPIN:', error);
      showToast('Failed to save MPIN. Please try again.');
    } finally {
      console.log('Create MPIN process completed');
      setIsLoading(false);
    }
  };

  const handleForgotMpin = async () => {
    console.log('Forgot MPIN button pressed');
    Alert.alert(
      'Reset MPIN',
      'Are you sure you want to reset your MPIN? You will need to verify OTP again.',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('MPIN reset cancelled')
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            console.log('User confirmed MPIN reset');
            try {
              console.log('Removing MPIN data from AsyncStorage');
              await AsyncStorage.removeItem('mpin');
              await AsyncStorage.removeItem('isMpinCreated');
              await AsyncStorage.removeItem('isOtpVerified');
              console.log('MPIN data removed, navigating to OTP screen');
              navigation.replace('OTP');
            } catch (error) {
              console.error('Failed to reset MPIN:', error);
              showToast('Failed to reset MPIN. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCard}>
              <View style={styles.logoRow}>
                <Image
                  source={require('../../assets/logo2.png')}
                  style={styles.logoImage}
                />
                <Text style={styles.logoText}>Jaiguru Jewellers </Text>
              </View>
              <Text style={styles.subtitleText}>(GOLD | SILVER | DIAMOND)</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.headerSection}>
              <Text style={styles.title}>Create MPIN</Text>
              <Text style={styles.description}>Set up a secure 4-digit PIN for quick access</Text>
            </View>
            <View style={styles.mpinSection}>
              <Text style={styles.mpinLabel}>Enter 4-Digit MPIN</Text>
              <View style={styles.mpinContainer}>
                {mpin.map((digit, index) => (
                  <View key={index} style={styles.mpinInputWrapper}>
                    <TextInput
                      ref={(ref) => {
                        inputRefs.current[index] = ref;
                        console.log(`Input ref ${index} set`);
                      }}
                      style={[styles.mpinInput, digit ? styles.mpinInputFilled : {}]}
                      maxLength={1}
                      keyboardType="numeric"
                      value={digit}
                      onChangeText={(value) => handleMpinChange(value, index)}
                      onKeyPress={(event) => handleKeyPress(event, index)}
                      secureTextEntry={true}
                      textAlign="center"
                      selectTextOnFocus={true}
                    />
                    {digit ? <View style={styles.filledIndicator} /> : null}
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.actionSection}>
              <TouchableOpacity onPress={handleForgotMpin} style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot MPIN?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  mpin.join('').length === 4 ? styles.createButtonActive : {},
                  isLoading ? styles.createButtonLoading : {}
                ]}
                onPress={handleCreateMpin}
                disabled={mpin.join('').length !== 4 || isLoading}
              >
                <Text style={[
                  styles.createButtonText,
                  mpin.join('').length === 4 ? styles.createButtonTextActive : {}
                ]}>
                  {isLoading ? 'Creating...' : 'Create MPIN'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

function VerifyMpinScreen({ navigation }) {
  console.log('VerifyMpinScreen component rendered');
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    console.log('VerifyMpinScreen useEffect triggered');
    animateIn();
  }, []);

  const animateIn = () => {
    console.log('Starting animation in VerifyMpinScreen');
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
      })
    ]).start(() => {
      console.log('Animation completed in VerifyMpinScreen');
    });
  };

  const handleMpinChange = (value, index) => {
    console.log(`MPIN input changed at index ${index}, value: ${value}`);
    if (value && !/^\d$/.test(value)) {
      console.log('Invalid input: not a digit, ignoring');
      return;
    }
    
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);
    console.log(`Updated MPIN array: [${newMpin}]`);

    if (value && index < 3) {
      console.log(`Moving focus to next input at index ${index + 1}`);
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      console.log(`Moving focus to previous input at index ${index - 1}`);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    console.log(`Key pressed: ${event.nativeEvent.key} at index ${index}`);
    if (event.nativeEvent.key === 'Backspace' && !mpin[index] && index > 0) {
      console.log('Backspace pressed on empty field, moving to previous input');
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyMpin = async () => {
    console.log('Verify MPIN button pressed');
    const enteredMpin = mpin.join('');
    console.log(`Entered MPIN: ${enteredMpin}`);

    if (enteredMpin.length !== 4) {
      console.log('Invalid MPIN length, showing error');
      showToast('Please enter a valid 4-digit MPIN.');
      return;
    }

    console.log('MPIN is valid, proceeding to verify');
    setIsLoading(true);
    try {
      console.log('Retrieving saved MPIN from AsyncStorage');
      const savedMpin = await AsyncStorage.getItem('mpin');
      console.log(`Saved MPIN from storage: ${savedMpin}`);
      
      if (enteredMpin === savedMpin) {
        console.log('MPIN verification successful');
        showToast('MPIN verified successfully!');
        setTimeout(() => {
          console.log('Navigating to Drawer screen');
          navigation.replace('Drawer');
        }, 1000);
      } else {
        console.log('MPIN verification failed');
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setMpin(['', '', '', '']);
        console.log(`Attempt ${newAttempts} failed, resetting MPIN fields`);
        inputRefs.current[0]?.focus();
        
        if (newAttempts >= 2) {
          console.log('Maximum attempts reached, showing alert');
          Alert.alert(
            'Too Many Attempts',
            'You have exceeded the maximum number of attempts. Please reset your MPIN.',
            [
              { 
                text: 'Cancel', 
                style: 'cancel',
                onPress: () => console.log('User cancelled MPIN reset')
              },
              { 
                text: 'Reset MPIN', 
                onPress: () => {
                  console.log('User chose to reset MPIN, navigating to OTP screen');
                  navigation.navigate('OTP');
                }
              }
            ]
          );
        } else {
          console.log(`Showing attempt warning. ${2 - newAttempts} attempts remaining`);
          showToast(`Incorrect MPIN. ${2 - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      console.error('Failed to verify MPIN:', error);
      showToast('Failed to verify MPIN. Please try again.');
    } finally {
      console.log('Verify MPIN process completed');
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCard}>
              <View style={styles.logoRow}>
                <Image
                  source={require('../../assets/logo2.png')}
                  style={styles.logoImage}
                />
                <Text style={styles.logoText}>Jaiguru Jewellers Pvt Ltd</Text>
              </View>
              <Text style={styles.subtitleText}>(GOLD | SILVER | DIAMOND)</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.headerSection}>
              <Text style={styles.title}>Enter Your MPIN</Text>
              <Text style={styles.description}>Enter your 4-digit PIN to continue</Text>
            </View>
            <View style={styles.mpinSection}>
              <Text style={styles.mpinLabel}>MPIN</Text>
              <View style={styles.mpinContainer}>
                {mpin.map((digit, index) => (
                  <View key={index} style={styles.mpinInputWrapper}>
                    <TextInput
                      ref={(ref) => {
                        inputRefs.current[index] = ref;
                        console.log(`Input ref ${index} set`);
                      }}
                      style={[styles.mpinInput, digit ? styles.mpinInputFilled : {}]}
                      maxLength={1}
                      keyboardType="numeric"
                      value={digit}
                      onChangeText={(value) => handleMpinChange(value, index)}
                      onKeyPress={(event) => handleKeyPress(event, index)}
                      secureTextEntry={true}
                      textAlign="center"
                      selectTextOnFocus={true}
                    />
                    {digit ? <View style={styles.filledIndicator} /> : null}
                  </View>
                ))}
              </View>
              {attempts > 0 && (
                <Text style={styles.attemptsText}>Attempts remaining: {3 - attempts}</Text>
              )}
            </View>
            <View style={styles.actionSection}>
              <TouchableOpacity onPress={() => {
                console.log('Forgot MPIN pressed, navigating to OTP screen');
                navigation.navigate('OTP');
              }} style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot MPIN?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  mpin.join('').length === 4 ? styles.createButtonActive : {},
                  isLoading ? styles.createButtonLoading : {}
                ]}
                onPress={handleVerifyMpin}
                disabled={mpin.join('').length !== 4 || isLoading}
              >
                <Text style={[
                  styles.createButtonText,
                  mpin.join('').length === 4 ? styles.createButtonTextActive : {}
                ]}>
                  {isLoading ? 'Verifying...' : 'Verify MPIN'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export { MpinScreen, VerifyMpinScreen };