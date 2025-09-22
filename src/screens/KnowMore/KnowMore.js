import React from 'react';
import { View, ScrollView, StyleSheet, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appTheme from '../../utils/Theme';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { COLORS, SIZES, FONTS } = appTheme;

function KnowMore() {
  const route = useRoute();
  const navigation = useNavigation();
  const { schemeId } = route.params || {};

  const DottedCircle = ({ iconName }) => (
    <View style={styles.dottedCircleContainer}>
      <View style={styles.dottedCircle}>
        <Icon name={iconName} size={scale(30)} color={COLORS.primary} />
      </View>
    </View>
  );

  // Custom Header Component
  const CustomHeader = () => (
    <LinearGradient
      colors={COLORS.gradientPrimary}
      style={styles.headerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.title} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Scheme Details</Text>
          {/* <Text style={styles.headerSubtitle}>DigiGold Investment Plan</Text> */}
        </View>

        <View style={styles.headerRight} />
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/bg.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Custom Header */}
        <CustomHeader />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>GOLD SCHEME</Text>

            <Text style={styles.description}>
              Choose your Gold Scheme because it offers a convenient and flexible way to save in gold through a mobile app, providing tiered benefits that allow users to earn additional gold weight on their savings. Gold Scheme is an ideal choice for customers seeking a secure and accessible investment in gold, with the option to redeem their savings for attractive gold jewellery at Jaiguru Jewellers.
            </Text>

            <Text style={styles.sectionTitle}>Process to Join:</Text>
            <View style={styles.stepContainerWithCircle}>
              <DottedCircle iconName="account-plus" />
              <Text style={styles.stepText}>Click "Join Now" On DigiGold Scheme</Text>
            </View>
            <View style={styles.stepContainerWithCircle}>
              <DottedCircle iconName="weight-kilogram" />
              <Text style={styles.stepText}>Enter Amount/Weight you wish to start with</Text>
            </View>
            <View style={styles.stepContainerWithCircle}>
              <DottedCircle iconName="credit-card-outline" />
              <Text style={styles.stepText}>Make Payment Using Any Mode</Text>
            </View>
            <View style={styles.stepContainerWithCircle}>
              <DottedCircle iconName="target" />
              <Text style={styles.stepText}>Set Saving Target (Optional)</Text>
            </View>
            <View style={styles.stepContainerWithCircle}>
              <DottedCircle iconName="check-circle-outline" />
              <Text style={styles.stepText}>Continue Your Savings</Text>
            </View>

            <Text style={styles.sectionTitle}>Process to Redeem:</Text>
            <View style={styles.stepContainerWithCircle}>
              <DottedCircle iconName="storefront-outline" />
              <Text style={styles.stepText}>Visit Jaiguru Jewellery</Text>
            </View>
            <View style={styles.stepContainerWithCircle}>
              <DottedCircle iconName="form-select" />
              <Text style={styles.stepText}>Submit Redemption Request Form</Text>
            </View>
            <View style={styles.stepContainerWithCircle}>
              <DottedCircle iconName="diamond-outline" />
              <Text style={styles.stepText}>Choose Jewel</Text>
            </View>

            <Text style={styles.sectionTitle}>Features & Benefits:</Text>
            <Text style={styles.subHeading}>Minimum Amount:</Text>
            <Text style={styles.description}>
              The minimum amount that can be saved in gold is Rs. 100. Users can save any amount above Rs. 100 at any time during the first 330 days from the date of the first payment.
            </Text>

            <Text style={styles.subHeading}>Scheme Period:</Text>
            <Text style={styles.description}>
              The scheme period of 330 days will begin on the date of the first payment made. During this period, users can save in gold any number of times. On the 330th day from the date of enrolment, the scheme will mature.
            </Text>

            <Text style={styles.subHeading}>Benefits:</Text>
            <Text style={styles.description}>
              Users will be eligible for benefits on the gold weight being saved in their account, as per the following slab system:
            </Text>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitText}>First 75 days - 5% benefit</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitText}>76th to 150th Days - 3.75% benefit</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitText}>151st to 225th Days - 2% benefit</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitText}>226th to 300th Days - 0.75% benefit</Text>
            </View>
            <Text style={styles.description}>
              Please note that no benefits will be offered for payments made during the final 30 days of the scheme period (i.e., 301st day to 330th day). Benefits will only be offered if the user redeems their account after maturity; otherwise, the benefit gold weight will not be offered.
            </Text>

            <Text style={styles.subHeading}>Redemption:</Text>
            <Text style={styles.description}>
              Saved gold weight can be redeemed and purchased as gold jewellery at any of Jaiguru stores located across Tamil Nadu or online by sending an email to digigoldsupport@jaiguru.com. Users must pay for GST and any value-added charges such as wastage charges, marking charges, stone charges, and hallmark charges, if applicable.
            </Text>
            <Text style={styles.description}>
              There is a minimum lock-in period of 30 days, during which users cannot redeem their savings. Only the person whose name was used at the time of registration can redeem the scheme, and they must submit original identification proof such as Aadhaar, PAN, driving license, or voter ID at the time of redemption. Users must redeem their scheme within 35 days from the date of maturity.
            </Text>

            <Text style={styles.subHeading}>Refunds:</Text>
            <Text style={styles.description}>
              The paid amount will not be refunded under any circumstances. This means that if the customer changes their mind after enrolling in the scheme and decides not to redeem the gold, they will not be able to get a refund of the amount paid.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.joinButton} 
                onPress={() => navigation.navigate('AddNewMember', { schemeId })}
              >
                <Text style={styles.joinButtonText}>Join Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => navigation.navigate('MainLanding')}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
  },
  // Header Styles
  headerGradient: {
    paddingTop: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
    borderBottomLeftRadius: SIZES.radius_lg,
    borderBottomRightRadius: SIZES.radius_lg,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SIZES.margin,
  },
  headerTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: 2,
  },
  headerSubtitle: {
    ...FONTS.fontXs,
    color: COLORS.text,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SIZES.padding * 2,
  },
  content: {
    // backgroundColor: 'rgba(26, 26, 26, 0.95)',
    backgroundColor: COLORS.outline,
    margin: SIZES.margin,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    ...FONTS.h5,
    color: COLORS.title,
    marginBottom: SIZES.margin,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  description: {
    ...FONTS.fontSm,
    color: COLORS.text,
    marginBottom: SIZES.margin,
    lineHeight: 20,
    textTransform:"capitalize"
  },
  sectionTitle: {
    ...FONTS.h6,
    color: COLORS.title,
    marginVertical: SIZES.margin,
    textDecorationLine: 'underline',
  },
  subHeading: {
    ...FONTS.font,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: SIZES.margin / 2,
  },
  stepContainerWithCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 2,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dottedCircleContainer: {
    marginRight: SIZES.margin,
  },
  dottedCircle: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    borderWidth: scale(1),
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  stepText: {
    ...FONTS.fontSm,
    color: COLORS.text,
    flex: 1,
  },
  benefitItem: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius_sm,
    padding: SIZES.padding / 2,
    marginBottom: SIZES.margin / 2,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  benefitText: {
    ...FONTS.fontSm,
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.margin * 2,
    gap: SIZES.margin,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    flex: 1,
  },
  closeButton: {
    backgroundColor: COLORS.card,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flex: 1,
  },
  joinButtonText: {
    ...FONTS.fontSm,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  closeButtonText: {
    ...FONTS.fontSm,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default KnowMore;