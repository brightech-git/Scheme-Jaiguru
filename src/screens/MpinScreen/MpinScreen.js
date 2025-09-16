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
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './MpinStyles';

// Toast function for iOS
const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
};

function MpinScreen({ route, navigation }) {
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    checkIfMpinCreated();
    animateIn();
  }, []);

  const animateIn = () => {
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
    ]).start();
  };

  const checkIfMpinCreated = async () => {
    try {
      const isMpinCreated = await AsyncStorage.getItem('isMpinCreated');
      if (isMpinCreated === 'true') {
        navigation.replace('VerifyMpin');
      }
    } catch (error) {
      console.error('Error checking MPIN creation:', error);
    }
  };

  const handleMpinChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCreateMpin = async () => {
    const enteredMpin = mpin.join('');

    if (enteredMpin.length !== 4) {
      showToast('Please enter a valid 4-digit MPIN.');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('mpin', enteredMpin);
      await AsyncStorage.setItem('isMpinCreated', 'true');
      showToast('MPIN created successfully!');
      setTimeout(() => {
        navigation.replace('Drawer');
      }, 1000);
    } catch (error) {
      showToast('Failed to save MPIN. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotMpin = async () => {
    Alert.alert(
      'Reset MPIN',
      'Are you sure you want to reset your MPIN? You will need to verify OTP again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('mpin');
              await AsyncStorage.removeItem('isMpinCreated');
              await AsyncStorage.removeItem('isOtpVerified');
              navigation.replace('OTP');
            } catch (error) {
              showToast('Failed to reset MPIN. Please try again.');
              console.error(error);
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
                      ref={(ref) => (inputRefs.current[index] = ref)}
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
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    animateIn();
  }, []);

  const animateIn = () => {
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
    ]).start();
  };

  const handleMpinChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyMpin = async () => {
    const enteredMpin = mpin.join('');

    if (enteredMpin.length !== 4) {
      showToast('Please enter a valid 4-digit MPIN.');
      return;
    }

    setIsLoading(true);
    try {
      const savedMpin = await AsyncStorage.getItem('mpin');
      if (enteredMpin === savedMpin) {
        showToast('MPIN verified successfully!');
        setTimeout(() => {
          navigation.replace('Drawer');
        }, 1000);
      } else {
        setAttempts(prev => prev + 1);
        setMpin(['', '', '', '']);
        inputRefs.current[0]?.focus();
        
        if (attempts >= 2) {
          Alert.alert(
            'Too Many Attempts',
            'You have exceeded the maximum number of attempts. Please reset your MPIN.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset MPIN', onPress: () => navigation.navigate('OTP') }
            ]
          );
        } else {
          showToast(`Incorrect MPIN. ${2 - attempts} attempts remaining.`);
        }
      }
    } catch (error) {
      showToast('Failed to verify MPIN. Please try again.');
      console.error(error);
    } finally {
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
                      ref={(ref) => (inputRefs.current[index] = ref)}
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
              <TouchableOpacity onPress={() => navigation.navigate('OTP')} style={styles.forgotButton}>
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