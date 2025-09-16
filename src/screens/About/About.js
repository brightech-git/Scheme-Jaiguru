import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import appTheme from '../../utils/Theme';
import styles from './AboutStyles';

const { COLORS, SIZES, FONTS } = appTheme;

const AboutPage = () => {
  const navigation = useNavigation();

  const features = [
    {
      icon: 'diamond',
      title: 'Uncompromising Quality',
      description: 'We use only the finest materials and employ skilled artisans to create jewellery that stands the test of time.',
      color: COLORS.gold,
    },
    {
      icon: 'handshake',
      title: 'Trust & Transparency',
      description: "For generations, we've built relationships based on honesty, with no hidden costs or compromises.",
      color: COLORS.secondary,
    },
    {
      icon: 'auto-awesome',
      title: 'Heritage & Innovation',
      description: 'We honor traditional craftsmanship while embracing innovative designs for the modern customer.',
      color: COLORS.accent,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={SIZES.h4} color={COLORS.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>About Jaiguru Jewellers</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <LinearGradient
            colors={[COLORS.gold, COLORS.goldLight]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="storefront" size={SIZES.h1} color={COLORS.white} />
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="book" size={SIZES.h4} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Our Story</Text>
          </View>
          <Text style={styles.sectionContent}>
            Jaiguru Jewellers began as a small, family-run business with a simple goal: to offer high-quality, genuine jewellery to the people of Madurai. What started as a humble endeavour has now grown into a trusted name, recognized for our dedication to craftsmanship, value, and customer care.
          </Text>
          <Text style={styles.sectionContent}>
            In a city known for its cultural richness and historic landmarks, Jaiguru Jewellers has created a legacy of trust by offering fine jewellery that embodies both tradition and modern elegance.
          </Text>
          <Text style={styles.sectionContent}>
            Over the years, we have expanded our offerings while staying true to our core principles of fairness, transparency, and integrity. We take pride in the fact that we have built lasting relationships with our customers, many of whom continue to return to us for their special occasions and jewellery needs.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="precision-manufacturing" size={SIZES.h4} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Our Craftsmanship</Text>
          </View>
          <Text style={styles.sectionContent}>
            Our master craftsmen blend traditional techniques with contemporary design, creating pieces that honor heritage while embracing modern aesthetics. Each jewellery item is meticulously crafted with attention to every detail.
          </Text>
          <Text style={styles.sectionContent}>
            We specialize in exquisite gold jewellery, brilliant diamonds, and vibrant precious stones, ensuring that every piece meets our rigorous standards of quality and beauty.
          </Text>
          
          <View style={styles.certificationBox}>
            <LinearGradient
              colors={[COLORS.successLight, COLORS.successLighter]}
              style={styles.certificationGradient}
            >
              <MaterialIcons name="verified" size={SIZES.h3} color={COLORS.success} />
              <Text style={styles.certificationText}>
                Every item in our collection is crafted using <Text style={styles.boldText}>92.5 BIS hallmark-certified silver</Text>, ensuring purity, quality, and authenticity.
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="star" size={SIZES.h4} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Why Choose Us</Text>
          </View>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <LinearGradient
                colors={[`${feature.color}33`, `${feature.color}1A`]}
                style={styles.featureGradient}
              >
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}4D` }]}>
                  <MaterialIcons name={feature.icon} size={SIZES.h4} color={feature.color} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="flag" size={SIZES.h4} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <View style={styles.missionBox}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.missionGradient}
            >
              <Text style={styles.missionText}>
                At Jaiguru Jewellers, our mission is to make high-quality, beautifully designed jewellery accessible to everyone.
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.sectionContent}>
            We believe in offering our customers genuine products without hidden costs or extra charges. Every item reflects our commitment to providing products that meet the highest standards in the industry.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="visibility" size={SIZES.h4} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Our Vision</Text>
          </View>
          <View style={styles.visionBox}>
            <LinearGradient
              colors={[COLORS.light, COLORS.white]}
              style={styles.visionGradient}
            >
              <MaterialIcons name="trending-up" size={SIZES.h3} color={COLORS.accent} />
              <Text style={styles.visionText}>
                As we continue to grow, our vision is to become a leading name in the jewellery industry, known for our unwavering commitment to quality, transparency, and customer satisfaction.
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.sectionContent}>
            We aim to expand our reach beyond Madurai, bringing our exceptional services and products to customers across South India and beyond, while always maintaining the same personal touch that has defined us since day one.
          </Text>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="favorite" size={SIZES.h4} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Our Promise</Text>
          </View>
          <View style={styles.promiseBox}>
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.light]}
              style={styles.promiseGradient}
            >
              <MaterialIcons name="handshake" size={SIZES.h3} color={COLORS.accent} />
              <Text style={styles.promiseText}>
                We promise to continue delivering exceptional value, maintaining the highest standards of craftsmanship, and upholding the trust that our customers have placed in us for generations.
              </Text>
              <Text style={[styles.promiseText, styles.boldText]}>
                Your satisfaction is our ultimate goal, and we strive to make every interaction with Jaiguru Jewellers a memorable experience.
              </Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutPage;