import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import appTheme from '../../utils/Theme';
import styles from './Styles';

const { COLORS, SIZES } = appTheme;
const { width } = Dimensions.get('window');
const SUPPORT_NUMBER = '919600972227';

function HelpCenterPage() {
  const handlePhoneCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleOpenMap = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleWhatsApp = (message) => {
    const url = `https://wa.me/${SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert('Make sure WhatsApp is installed');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.title}>Help Center</Text>
          <Text style={styles.subtitle}>We're here to help you</Text>
        </LinearGradient>

        <View style={styles.cardsContainer}>
          <LinearGradient
            colors={[COLORS.light, COLORS.white]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.phoneIconContainer]}>
                <Icon name="phone" size={SIZES.h4} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>Phone Numbers</Text>
            </View>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handlePhoneCall('919600972227')}
            >
              <Text style={styles.contactText}>+91-9600972227</Text>
              <Icon name="call" size={SIZES.fontLg} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handlePhoneCall('919884808428')}
            >
              <Text style={styles.contactText}>+91-9884808428</Text>
              <Icon name="call" size={SIZES.fontLg} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handlePhoneCall('919169161469')}
            >
              <Text style={styles.contactText}>+91-9169161469</Text>
              <Icon name="call" size={SIZES.fontLg} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={[COLORS.light, COLORS.white]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.emailIconContainer]}>
                <Icon name="email" size={SIZES.h4} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>Email Address</Text>
            </View>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleEmail('Contact@JaiGurujewellers.in')}
            >
              <Text style={styles.contactText}>Contact@JaiGurujewellers.in</Text>
              <Icon name="mail-outline" size={SIZES.fontLg} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={[COLORS.light, COLORS.white]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.locationIconContainer]}>
                <Icon name="location-on" size={SIZES.h4} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>Showroom Addresses</Text>
            </View>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleOpenMap('Jaiguru Jewellers, 712, TNHB, Kakkalur Bypass Road, Tiruvallur - 602001')}
            >
              <View style={styles.addressContainer}>
                <Text style={styles.contactText}>Tiruvallur Showroom</Text>
                <Text style={styles.contactText}>712, TNHB, Kakkalur Bypass Road, Tiruvallur - 602001</Text>
              </View>
              <Icon name="place" size={SIZES.fontLg} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleOpenMap('Jaiguru Jewellers, 321/322 Ma Po Si Salai, Tiruttani')}
            >
              <View style={styles.addressContainer}>
                <Text style={styles.contactText}>Tiruttani Showroom</Text>
                <Text style={styles.contactText}>321/322 Ma Po Si Salai, Tiruttani</Text>
              </View>
              <Icon name="place" size={SIZES.fontLg} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.hoursContainer}>
          <Text style={styles.hoursTitle}>Customer Support Hours</Text>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Monday - Saturday</Text>
            <Text style={styles.hoursTime}>10:00 AM - 6:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Sunday</Text>
            <Text style={styles.hoursTime}>11:00 AM - 4:00 PM</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleWhatsApp('Hello! I need help via Live Chat.')}
            >
              <Icon name="chat" size={SIZES.h4} color={COLORS.primary} />
              <Text style={styles.actionText}>Live Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleWhatsApp('I would like to see the FAQs.')}
            >
              <Icon name="help-outline" size={SIZES.h4} color={COLORS.primary} />
              <Text style={styles.actionText}>FAQs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handlePhoneCall('919600972227')}
            >
              <Icon name="description" size={SIZES.h4} color={COLORS.primary} />
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HelpCenterPage;