import React, { useEffect, useRef } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TextDefault } from '../../components';
import appTheme from '../../utils/Theme';
import { scale, verticalScale } from '../../utils';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  SlideInRight,
  SequencedTransition,
  Layout
} from 'react-native-reanimated';

const { COLORS, SIZES, FONTS } = appTheme;

const TermsConditionsPage = ({ navigation }) => {
  const scrollViewRef = useRef(null);

  const termsData = [
    {
      title: '1. Product Representation',
      icon: 'image-outline',
      content: [
        'Images are for reference only. Minor variations in color or finish may occur.',
        'All products are handcrafted, so slight irregularities are natural.',
        'For exact details, contact us before ordering.',
      ],
    },
    {
      title: '2. Pricing',
      icon: 'pricetag-outline',
      subtitle: 'Currency & Taxes',
      content: ['All prices are in INR and inclusive of GST'],
      subsections: [
        {
          title: 'Price Changes',
          content: [
            'Prices may change without prior notice',
            'Final amount charged will be as displayed at checkout.',
          ],
        },
      ],
    },
    {
      title: '3. Payments',
      icon: 'card-outline',
      content: [
        'We accept:',
        '• Online Payments',
        '• UPI',
        '• Debit/Credit Cards',
        '• Net Banking',
        '• Cash on Delivery (Selected PIN codes only)',
        '• ₹50 COD fee may apply',
      ],
    },
    {
      title: '4. Product Use & Care',
      icon: 'construct-outline',
      content: [
        'Handle gold-polished jewellery with care. Avoid water & chemicals.',
        'Store in a dry pouch when not in use.',
        'No guarantee for polish durability; depends on usage.',
        'Ask us for maintenance tips to extend product life.',
      ],
    },
    {
      title: '5. Limitation of Liability',
      icon: 'warning-outline',
      content: [
        'We are not liable for:',
        '• Shipping delays or damage',
        '• Force majeure events',
        '• Improper use or care',
      ],
    },
    {
      title: '6. Intellectual Property',
      icon: 'business-outline',
      content: [
        'All content is © and the property of our brand. No part may be:',
        '• Copied or redistributed without permission',
        '• Used commercially',
        '• Altered or modified',
      ],
    },
    {
      title: '7. Governing Law',
      icon: 'document-text-outline',
      content: [
        'These terms are governed by Indian law.',
        'Disputes will be settled in Madurai, Tamil Nadu.',
        'Contact us before placing orders if you have any questions.',
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientPrimary3}
        style={styles.background}
      >
        <Animated.View 
          style={styles.header}
          entering={FadeIn.duration(600)}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={SIZES.h3} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <TextDefault style={[styles.title, FONTS.h4]}>Terms & Conditions</TextDefault>
            <View style={styles.titleUnderline} />
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="document-text" size={scale(24)} color={COLORS.white} />
          </View>
        </Animated.View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={styles.contentContainer}
            entering={FadeInDown.duration(800).delay(200)}
            layout={Layout.delay(100)}
          >
            {termsData.map((section, index) => (
              <Animated.View 
                key={index} 
                style={styles.section}
                entering={SlideInRight.duration(500).delay(index * 100)}
                layout={Layout.springify()}
              >
                <View style={styles.sectionHeader}>
                  <Ionicons 
                    name={section.icon} 
                    size={scale(18)} 
                    color={COLORS.primary} 
                    style={styles.sectionIcon}
                  />
                  <TextDefault style={[styles.sectionTitle]}>
                    {section.title}
                  </TextDefault>
                </View>
                
                {section.subtitle && (
                  <TextDefault style={[styles.subtitle]}>
                    {section.subtitle}
                  </TextDefault>
                )}
                
                {section.content.map((point, pointIndex) => (
                  <Animated.View 
                    key={pointIndex} 
                    style={styles.pointContainer}
                    entering={FadeIn.duration(400).delay((index * 100) + (pointIndex * 50))}
                    layout={SequencedTransition.delay(100)}
                  >
                    <View style={styles.bullet} />
                    <TextDefault style={[styles.pointText]}>
                      {point}
                    </TextDefault>
                  </Animated.View>
                ))}
                
                {section.subsections &&
                  section.subsections.map((subsection, subIndex) => (
                    <Animated.View 
                      key={subIndex} 
                      style={styles.subsection}
                      entering={FadeIn.duration(500).delay((index * 100) + 200)}
                    >
                      <TextDefault style={[styles.subsectionTitle, FONTS.subheading]}>
                        {subsection.title}
                      </TextDefault>
                      {subsection.content.map((point, pointIndex) => (
                        <View key={pointIndex} style={styles.pointContainer}>
                          <View style={styles.subBullet} />
                          <TextDefault style={[styles.pointText]}>
                            {point}
                          </TextDefault>
                        </View>
                      ))}
                    </Animated.View>
                  ))}
              </Animated.View>
            ))}
            
            {/* <Animated.View 
              style={styles.footer}
              entering={FadeIn.duration(600).delay(800)}
            >
              <TextDefault style={[styles.lastUpdated, FONTS.fontXs]}>
                Last Updated: September 20, 2025
              </TextDefault>
              <TouchableOpacity 
                style={styles.contactButton}
                activeOpacity={0.7}
                // onPress={() => navigation.navigate('Contact')}
              >
                <TextDefault style={[styles.contactText, FONTS.fontSm]}>
                  Contact Us for Questions
                </TextDefault>
                <Ionicons name="chatbubble-ellipses" size={scale(16)} color={COLORS.primary} />
              </TouchableOpacity>
            </Animated.View> */}
          </Animated.View>
        </ScrollView>
        
        {/* <Animated.View 
          style={styles.scrollTopButton}
          entering={FadeIn.duration(600).delay(1000)}
        >
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-up" size={scale(20)} color={COLORS.white} />
          </TouchableOpacity>
        </Animated.View> */}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(SIZES.padding),
    paddingBottom: scale(SIZES.margin * 3),
    
  },
  header: {
    padding: scale(SIZES.padding),
    paddingTop: verticalScale(SIZES.padding * 1.5),
    paddingBottom: verticalScale(SIZES.padding),
    borderBottomLeftRadius: scale(SIZES.radius_lg),
    borderBottomRightRadius: scale(SIZES.radius_lg),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(SIZES.margin),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    position: 'relative',
  },
  backButton: {
    padding: scale(SIZES.padding / 2),
    justifyContent: 'center',
    zIndex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: scale(SIZES.radius),
    backgroundColor: COLORS.title,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerIcon: {
    position: 'absolute',
    right: scale(SIZES.padding),
    opacity: 0.7,
  },
  title: {
    color: COLORS.white,
    marginBottom: scale(10),
  },
  titleUnderline: {
    width: scale(60),
    height: scale(3),
    backgroundColor: COLORS.primaryLight,
    borderRadius: scale(2),
  },
  contentContainer: {
    backgroundColor: COLORS.outline,
    borderRadius: scale(SIZES.radius_lg),
    padding: scale(SIZES.padding * 1.5),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  section: {
    marginBottom: scale(SIZES.margin * 1.5),
    borderLeftWidth: scale(3),
    borderLeftColor: COLORS.primary,
    paddingLeft: scale(SIZES.padding),
    paddingVertical: scale(SIZES.padding / 2),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(SIZES.margin / 2),
  },
  sectionIcon: {
    marginRight: scale(SIZES.margin / 2),
  },
  sectionTitle: {
    color: COLORS.primary,
    marginBottom: scale(SIZES.margin / 2),
    ...FONTS.subheading,
    fontSize: verticalScale(SIZES.h6),
  },
  subtitle: {
    color: COLORS.title,
    marginBottom: scale(SIZES.margin / 2),
    marginLeft: scale(SIZES.margin),
    fontSize: verticalScale(SIZES.h6-4),
  },
  subsection: {
    marginLeft: scale(SIZES.padding),
    marginTop: scale(SIZES.margin / 2),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: scale(SIZES.padding / 2),
    borderRadius: scale(SIZES.radius),
  },
  subsectionTitle: {
    color: COLORS.text,
    marginBottom: scale(5),
    fontSize: verticalScale(SIZES.h6-4),
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(6),
  },
  bullet: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: COLORS.primary,
    marginRight: scale(SIZES.margin / 1.5),
    marginTop: scale(8),
  },
  subBullet: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: COLORS.textLight,
    marginRight: scale(SIZES.margin / 1.5),
    marginTop: scale(9),
    marginLeft: scale(SIZES.margin / 2),
  },
  pointText: {
    flex: 1,
    color: COLORS.text,
    lineHeight: scale(20),
    fontSize: verticalScale(SIZES.h6-4),
    ...FONTS.subheading
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    paddingTop: scale(SIZES.padding),
    alignItems: 'center',
    marginTop: scale(SIZES.margin),
  },
  lastUpdated: {
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginBottom: scale(SIZES.margin),
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    padding: scale(SIZES.padding / 1.5),
    borderRadius: scale(SIZES.radius),
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  contactText: {
    color: COLORS.primary,
    marginRight: scale(SIZES.margin / 2),
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: scale(SIZES.margin * 2),
    right: scale(SIZES.margin * 2),
  },
  topButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TermsConditionsPage;