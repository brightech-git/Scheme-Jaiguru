import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
  Dimensions,
  Animated,
  StatusBar,
  Linking,
  Platform
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient'; // If using Expo, or use react-native-linear-gradient
import { BottomTab } from '../../components';
const { width } = Dimensions.get('window');

const SupportHome = ({ navigation }) => {
  const [faqExpanded, setFaqExpanded] = useState(null);

  // Keep fadeAnim stable across renders
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const contactOptions = [
    {
      id: 1,
      title: 'Contact via Email',
      description: 'We\'ll respond within 24 hours',
      iconName: 'mail',
      screen: 'EmailSupport',
      color: '#983be4ff',
      gradient: ['#7e57d8ff', '#c9a6a1ff'],
      availability: '24/7',
    },
    {
      id: 2,
      title: 'Contact via WhatsApp',
      description: 'Chat directly with our support team',
      iconName: 'message-circle',
      screen: 'WhatsAppSupport',
      color: '#25D366',
      gradient: ['#25D366', '#128C7E'],
      availability: 'Available now',
    },
    
    {
      id: 3,
      title: 'Live Chat',
      description: 'Instant support during business hours',
      iconName: 'message-square',
      screen: 'EmailSupport',
      color: '#5865F2',
      gradient: ['#5865F2', '#4752C4'],
      availability: '9AM-6PM',
    },
  ];

  const faqItems = [
    {
      id: 1,
      question: 'How do I buy digital gold?',
      answer: 'You can buy digital gold through our app by selecting the "Buy" option, choosing the amount, and completing the payment process.',
    },
    {
      id: 2,
      question: 'What are the storage charges?',
      answer: 'We charge 0.5% per annum on the value of gold stored. There are no charges for the first month.',
    },
    {
      id: 3,
      question: 'How can I sell my gold?',
      answer: 'Navigate to the "Sell" section, enter the quantity you wish to sell, and confirm the transaction. Funds will be transferred to your bank account within 24 hours.',
    },
    {
      id: 4,
      question: 'Is my investment secure?',
      answer: 'Yes, your gold is securely stored in insured vaults and fully backed by physical gold.',
    },
  ];

  const handleNavigation = (screen, option) => {
    console.log(`Navigating to ${screen}`);
    navigation.navigate(screen, { option });
  };

  const handleFaqPress = (id) => {
    setFaqExpanded(faqExpanded === id ? null : id);
  };

const handleEmergencySupport = () => {
  const phoneNumber = '9600972227';
  let url = '';

  if (Platform.OS === 'android') {
    url = `tel:${phoneNumber}`;
  } else {
    url = `telprompt:${phoneNumber}`;
  }

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Error', 'Your device cannot make a phone call');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('Error opening dialer', err));
};

  const renderContactOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionCard}
      onPress={() => handleNavigation(option.screen, option)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={option.gradient}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Feather name={option.iconName} size={24} color="#FFF" />
        <View style={styles.availabilityBadge}>
          <Text style={styles.availabilityText}>{option.availability}</Text>
        </View>
      </LinearGradient>
      
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
      </View>
      
      <View style={styles.optionRightSection}>
        <Feather name="chevron-right" size={20} color="#C0C0C0" />
      </View>
    </TouchableOpacity>
  );

  const renderFaqItem = (faq) => (
    <View key={faq.id} style={styles.faqCard}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={() => handleFaqPress(faq.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Feather 
          name={faqExpanded === faq.id ? 'chevron-up' : 'chevron-down'} 
          size={22} 
          color="#4A5568" 
        />
      </TouchableOpacity>
      
      {faqExpanded === faq.id && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
          <TouchableOpacity style={styles.helpfulButton}>
            <Text style={styles.helpfulButtonText}>Was this helpful?</Text>
            <View style={styles.helpfulButtons}>
              <TouchableOpacity style={styles.thumbButton}>
                <Feather name="thumbs-up" size={16} color="#48BB78" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.thumbButton}>
                <Feather name="thumbs-down" size={16} color="#E53E3E" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header Section */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerIconContainer}>
                <Feather name="headphones" size={32} color="#FFF" />
              </View>
              <Text style={styles.headerTitle}>How can we help?</Text>
              <Text style={styles.headerSubtitle}>
                Our support team is here to assist you 24/7. Choose your preferred contact method or browse FAQs.
              </Text>
            </View>
          </LinearGradient>

          {/* Emergency Support Banner */}
          <TouchableOpacity style={styles.emergencyBanner} onPress={handleEmergencySupport}>
            <View style={styles.emergencyIcon}>
              <Feather name="alert-circle" size={24} color="#FFF" />
            </View>
            <View style={styles.emergencyText}>
              <Text style={styles.emergencyTitle}>24/7 Emergency Support</Text>
              <Text style={styles.emergencySubtitle}>Immediate assistance for urgent issues</Text>
            </View>
            <Feather name="phone" size={20} color="#FFF" />
          </TouchableOpacity>

          {/* Contact Options Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            {contactOptions.map(renderContactOption)}
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>FAQs</Text>
              {/* <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <Feather name="arrow-right" size={16} color="#667eea" />
              </TouchableOpacity> */}
            </View>
            {faqItems.map(renderFaqItem)}
          </View>
        </Animated.View>
      </ScrollView>
      <BottomTab screen="SUPPORT" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 22,
  },
  emergencyBanner: {
    backgroundColor: '#E53E3E',
    marginHorizontal: 20,
    marginTop: -15,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
  },
  emergencyIcon: {
    marginRight: 12,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  emergencySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginRight: 4,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  availabilityBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A5568',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#718096',
  },
  optionRightSection: {
    marginLeft: 8,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  faqHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    color: '#4A5568',
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  faqAnswerContainer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 12,
  },
  helpfulButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpfulButtonText: {
    fontSize: 13,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  helpfulButtons: {
    flexDirection: 'row',
  },
  thumbButton: {
    padding: 6,
    marginLeft: 8,
    backgroundColor: '#F7FAFC',
    borderRadius: 6,
  },
  resourcesSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  resourcesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  resourceTitle: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SupportHome;