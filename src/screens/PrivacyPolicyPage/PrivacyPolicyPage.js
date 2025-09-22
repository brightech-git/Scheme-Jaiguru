import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import appTheme from '../../utils/Theme';
import { scale, verticalScale } from '../../utils/scaling';

const { COLORS, SIZES, FONTS } = appTheme;
const { width } = Dimensions.get('window');

const PrivacyPolicyPage = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleExternalLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Unable to open the link. Please try again.');
    }
  };

  const policySections = [
    {
      title: 'Information We Collect',
      icon: 'account-details',
      iconLib: MaterialCommunityIcons,
      content: 'Personal identification details (name, email, phone number, etc.), device information and browsing history, location and IP address.',
    },
    {
      title: 'How We Use Your Data',
      icon: 'analytics',
      iconLib: MaterialIcons,
      content: 'To improve our services and personalize your experience, to communicate offers, promotions, or important updates, for analytics and security enhancement.',
    },
    {
      title: 'What We Don\'t Do',
      icon: 'block-helper',
      iconLib: MaterialIcons,
      content: 'We do not sell your personal information. We do not track your location without consent.',
    },
    {
      title: 'Data Sharing',
      icon: 'share',
      iconLib: FontAwesome5,
      content: '',
      subsections: [
        {
          title: 'We Do Not Share With',
          content: 'Unaffiliated third parties, social media platforms',
        },
        {
          title: 'We May Share With',
          content: 'Trusted service providers, legal authorities (when required)',
        },
      ],
    },
    {
      title: 'Security Note',
      icon: 'shield-check',
      iconLib: MaterialCommunityIcons,
      content: 'Your data is encrypted and securely stored as per industry standards. We employ the latest security measures to protect your information.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={SIZES.h4} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.title, FONTS.h4]}>Privacy Policy</Text>
            <Text style={[styles.subtitle, FONTS.fontSm]}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Introduction */}
        <Animated.View style={[styles.introCard, { opacity: fadeAnim }]}>
          <View style={styles.introIcon}>
            <MaterialCommunityIcons name="lock" size={SIZES.h3} color={COLORS.primary} />
          </View>
          <Text style={[styles.introText, FONTS.subheading]}>
            At Jai Guru Jewellers, we value your privacy and are committed to protecting your personal information. 
            This policy outlines how we collect, use, and safeguard your data.
          </Text>
        </Animated.View>

        {/* Policy Sections */}
        {policySections.map((section, index) => (
          <Animated.View 
            key={index} 
            style={[styles.sectionCard, { opacity: fadeAnim }]}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                {section.iconLib === MaterialIcons ? (
                  <MaterialIcons name={section.icon} size={SIZES.h4} color={COLORS.primary} />
                ) : section.iconLib === FontAwesome5 ? (
                  <FontAwesome5 name={section.icon} size={SIZES.h4} color={COLORS.primary} />
                ) : (
                  <MaterialCommunityIcons name={section.icon} size={SIZES.h4} color={COLORS.primary} />
                )}
              </View>
              <Text style={[styles.sectionTitle]}>{section.title}</Text>
            </View>
            {section.content && (
              <Text style={[styles.sectionContent]}>{section.content}</Text>
            )}
            {section.subsections &&
              section.subsections.map((subsection, subIndex) => (
                <View key={subIndex} style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <View style={[styles.bulletPoint, {backgroundColor: COLORS.secondary}]} />
                    <Text style={[styles.subsectionTitle, FONTS.subheading]}>
                      {subsection.title}
                    </Text>
                  </View>
                  <Text style={[styles.subsectionContent]}>
                    {subsection.content}
                  </Text>
                </View>
              ))}
          </Animated.View>
        ))}

        {/* Security Badge */}
        <Animated.View style={[styles.securityBadge, { opacity: fadeAnim }]}>
          <MaterialCommunityIcons name="shield-check" size={SIZES.h3} color={COLORS.primary} />
          <Text style={[styles.securityText, FONTS.subheading]}>
            Your Data is Protected with 256-bit Encryption
          </Text>
        </Animated.View>

        {/* Additional Information */}
        <Animated.View style={[styles.additionalInfo, { opacity: fadeAnim }]}>
          <Text style={[styles.infoTitle, FONTS.h5]}>Additional Information</Text>
          <View style={styles.infoItem}>
            <View style={[styles.infoIcon, {backgroundColor: COLORS.primaryLight}]}>
              <Ionicons name="globe" size={SIZES.font} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoItemTitle, FONTS.subheading]}>Website</Text>
              <TouchableOpacity onPress={() => handleExternalLink('https://jaigurujewellers.com/')}>
                <Text style={[styles.link]}>
                  https://jaigurujewellers.com/
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={[styles.infoIcon, {backgroundColor: COLORS.primaryLight}]}>
              <Ionicons name="mail" size={SIZES.font} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoItemTitle, FONTS.subheading]}>Contact</Text>
              <Text style={[styles.infoItemContent]}>
                For privacy-related questions, please contact our support team at Contact@jaigurujewellers.in
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={[styles.infoIcon, {backgroundColor: COLORS.primaryLight}]}>
              <MaterialIcons name="update" size={SIZES.font} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoItemTitle, FONTS.subheading]}>Policy Updates</Text>
              <Text style={[styles.infoItemContent]}>
                We may update this policy periodically. Please check back for changes.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Consent Footer */}
        <View style={styles.consentFooter}>
          <MaterialCommunityIcons name="check-decagram" size={SIZES.h4} color={COLORS.primary} />
          <Text style={[styles.consentText, FONTS.subheading]}>
            By using our services, you consent to our privacy policy.
          </Text>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={[styles.copyrightText]}>
            © {new Date().getFullYear()} Jai Guru Jewellers. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: verticalScale(SIZES.margin * 2),
  },
  header: {
    padding: scale(SIZES.padding),
    paddingTop: verticalScale(SIZES.padding * 1.5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  backButton: {
    padding: scale(SIZES.padding / 2),
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: scale(SIZES.radius),
    borderColor: COLORS.borderColor,
    backgroundColor: COLORS.title,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginRight: scale(SIZES.h4), // To balance the back button space
  },
  title: {
    fontSize: scale(SIZES.h3),
    color: COLORS.primary,
    marginBottom: verticalScale(5),
    // fontWeight: 'bold',
  },
  subtitle: {
    fontSize: scale(SIZES.fontSm),
    color: COLORS.textLight,
  },
  introCard: {
    backgroundColor: COLORS.outline,
    borderRadius: scale(SIZES.radius_lg),
    padding: scale(SIZES.padding),
    margin: scale(SIZES.margin),
    marginTop: verticalScale(SIZES.margin * 1.5),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  introIcon: {
    marginRight: scale(SIZES.margin / 1.5),
    paddingTop: verticalScale(2),
  },
  introText: {
    color: COLORS.text,
    lineHeight: verticalScale(20),
    flex: 1,
   fontSize: verticalScale(SIZES.h6-4),
  },
  sectionCard: {
    backgroundColor: COLORS.outline,
    borderRadius: scale(SIZES.radius_lg),
    padding: scale(SIZES.padding),
    marginHorizontal: scale(SIZES.margin),
    marginBottom: verticalScale(SIZES.margin),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(SIZES.margin / 1.5),
  },
  iconContainer: {
    width: scale(SIZES.h3),
    height: scale(SIZES.h3),
    borderRadius: scale(SIZES.radius),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(SIZES.margin / 1.5),
  },
  sectionTitle: {
    color: COLORS.primary,
    flex: 1,
    fontWeight: '600',
    ...FONTS.heading,
  },
  sectionContent: {
    color: COLORS.text,
    lineHeight: verticalScale(20),
    ...FONTS.subheading,
    fontSize: verticalScale(SIZES.h6-4),
  },
  subsection: {
    marginTop: verticalScale(SIZES.margin / 1.5),
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  bulletPoint: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginRight: scale(SIZES.margin / 1.5),
  },
  subsectionTitle: {
    color: COLORS.secondary,
    fontWeight: '500',
  },
  subsectionContent: {
    color: COLORS.text,
    lineHeight: verticalScale(20),
    paddingLeft: scale(SIZES.margin),
    ...FONTS.subheading,
    fontSize: verticalScale(SIZES.h6-4),
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: scale(SIZES.radius_lg),
    padding: scale(SIZES.padding),
    marginHorizontal: scale(SIZES.margin),
    marginBottom: verticalScale(SIZES.margin),
  },
  securityText: {
    color: COLORS.primary,
    marginLeft: scale(SIZES.margin / 1.5),
    flex: 1,
    fontWeight: '500',
  },
  additionalInfo: {
    backgroundColor: COLORS.outline,
    borderRadius: scale(SIZES.radius_lg),
    padding: scale(SIZES.padding),
    marginHorizontal: scale(SIZES.margin),
    marginBottom: verticalScale(SIZES.margin),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    color: COLORS.primary,
    marginBottom: verticalScale(SIZES.margin),
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: verticalScale(SIZES.margin),
  },
  infoIcon: {
    width: scale(SIZES.h4),
    height: scale(SIZES.h4),
    borderRadius: scale(SIZES.radius_sm),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(SIZES.margin / 1.5),
  },
  infoContent: {
    flex: 1,
  },
  infoItemTitle: {
    color: COLORS.primary,
    marginBottom: verticalScale(5),
    fontWeight: '500',
    fontSize: verticalScale(SIZES.h6-4),
  },
  infoItemContent: {
    color: COLORS.text,
    lineHeight: verticalScale(20),
    fontSize: verticalScale(SIZES.h6-4),
    ...FONTS.subheading,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontSize: verticalScale(SIZES.h6-4),
    ...FONTS.subheading,
  },
  consentFooter: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: scale(SIZES.radius_lg),
    padding: scale(SIZES.padding),
    marginHorizontal: scale(SIZES.margin),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  consentText: {
    color: COLORS.primary,
    marginLeft: scale(SIZES.margin / 1.5),
    fontWeight: '500',
    fontSize: verticalScale(SIZES.h6-4),
  },
  copyright: {
    alignItems: 'center',
    marginTop: verticalScale(SIZES.margin),
    paddingHorizontal: scale(SIZES.margin),
    marginBottom: verticalScale(SIZES.margin * 2),
  },
  copyrightText: {
    color: COLORS.textLight,
    textAlign: 'center',
    fontSize: verticalScale(SIZES.h6-4),
    ...FONTS.body,
  },
});

export default PrivacyPolicyPage;