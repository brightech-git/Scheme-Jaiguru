import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  Alert,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TextDefault, BackHeader, BottomTab } from '../../components';
import appTheme from '../../utils/Theme';
import { scale, verticalScale } from '../../utils';

const { COLORS, SIZES, FONTS } = appTheme;

function DeleteAccount() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const clearStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length > 0) {
        await AsyncStorage.multiRemove(keys);
      }
    } catch (error) {
      throw new Error('Failed to clear storage');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirm Deletion',
      'This will permanently remove your account data from this device. You’ll need to sign up again to continue using the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await clearStorage();
              Alert.alert('Account Deleted', 'Your data has been removed successfully.', [
                {
                  text: 'OK',
                  onPress: () => navigation.replace('OTP'),
                },
              ]);
            } catch (error) {
              console.error('Error deleting account data:', error);
              Alert.alert(
                'Error',
                'We could not remove your account data. Please try again.',
                [
                  {
                    text: 'Retry',
                    onPress: handleDeleteAccount,
                  },
                  {
                    text: 'Cancel',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <TextDefault style={[styles.loadingText, FONTS.font]}>
            Removing your data...
          </TextDefault>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
      <BackHeader
        title="Delete Account"
        backPressed={() => navigation.goBack()}
        iconComponent={<Ionicons name="arrow-back" size={SIZES.h4} color={COLORS.white} />}
      />
      <Animated.View
        style={[
          styles.contentContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TextDefault style={[styles.title, FONTS.h4]}>
          Are you sure you want to delete your account?
        </TextDefault>
        <TextDefault style={[styles.description, FONTS.font]}>
          This will remove all your data from this device. You’ll need to sign up again to use the app.
        </TextDefault>
        <LinearGradient
          colors={COLORS.gradientSecondary} // Soft gold to classic gold
          style={styles.deleteButtonContainer}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            disabled={loading}
            accessibilityLabel="Delete Account"
            accessibilityRole="button"
          >
            <TextDefault style={[styles.buttonText, FONTS.h5]}>
              Delete Account
            </TextDefault>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <TextDefault style={[styles.cancelText, FONTS.subheading]}>
            Cancel
          </TextDefault>
        </TouchableOpacity>
      </Animated.View>
      <BottomTab screen="PROFILE" />
    </SafeAreaView>
  );
}

const styles = {
  flex: {
    flex: 1,
  },
  safeAreaStyle: {
    backgroundColor: COLORS.background, // White background (#FFFFFF)
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(SIZES.padding), // 16
    backgroundColor: COLORS.background, // White background (#FFFFFF)
  },
  title: {
    textAlign: 'center',
    color: COLORS.title, // Dark title (#222222)
    marginBottom: scale(SIZES.margin), // 16
  },
  description: {
    textAlign: 'center',
    color: COLORS.textLight, // Light grey (#666666)
    lineHeight: verticalScale(24),
    marginBottom: scale(SIZES.margin * 1.5), // 24
  },
  deleteButtonContainer: {
    borderRadius: scale(SIZES.radius_lg), // 16
    width: '100%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  deleteButton: {
    padding: scale(SIZES.padding), // 16
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white, // White for contrast
  },
  cancelButton: {
    paddingVertical: scale(SIZES.padding), // 16
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.primary, // Luxury gold (#1c467cff)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background, // White background (#FFFFFF)
  },
  loadingText: {
    marginTop: verticalScale(SIZES.margin), // 16
    color: COLORS.text, // Dark text (#222222)
  },
};

export default DeleteAccount;