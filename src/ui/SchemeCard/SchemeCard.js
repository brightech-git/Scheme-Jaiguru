import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  I18nManager,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TextDefault } from '../../components';
import { scale } from '../../utils';

const { width } = Dimensions.get('window');

function SchemeCard({ scheme, onPress, index = 0 }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400 + index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, index]);

  // Extract data with fallbacks
  const schemeName = scheme?.schemeName || scheme?.accountDetails?.schemeSummary?.schemeName || 'Unknown Scheme';
  const accountDetails = scheme?.accountDetails;
  const schemeSummary = accountDetails?.schemeSummary;
  const transBalance = schemeSummary?.schemaSummaryTransBalance;

  // Calculate values
  const totalInstallments = schemeSummary?.instalment || 0;
  const paidInstallments = transBalance?.insPaid || 0;
  const totalAmount = scheme?.totalAmount || scheme?.amountWeight?.Amount || 0;
  const savedWeight = scheme?.savedWeight || scheme?.amountWeight?.Weight || 0;
  const amountReceived = transBalance?.amtrecd || 0;

  // Progress calculation
  const progressPercentage = scheme?.progressPercentage || 
    (totalInstallments > 0 ? Math.round((paidInstallments / totalInstallments) * 100) : 0);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Determine if it's a Dream Gold plan
  const isDreamGoldPlan = schemeName.toLowerCase().includes('dream gold');

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${schemeName}`}
      >
        <LinearGradient
          colors={['rgba(55, 65, 81, 0.95)', 'rgba(79, 70, 229, 0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.schemeInfo}>
              <View style={styles.titleRow}>
                <MaterialCommunityIcons
                  name={isDreamGoldPlan ? "gold" : "diamond-stone"}
                  size={scale(18)}
                  color="#fff"
                />
                <TextDefault style={styles.schemeName} numberOfLines={1}>
                  {schemeName}
                </TextDefault>
              </View>
              <TextDefault style={styles.schemeCode}>
                {scheme?.groupcode}-{scheme?.regno}
              </TextDefault>
              <TextDefault style={styles.customerName} numberOfLines={1}>
                {scheme?.pname || 'Customer'}
              </TextDefault>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: scheme?.status === 'Active' ? '#34c759' : '#ef4444' },
              ]}
            >
              <TextDefault style={styles.statusText}>
                {scheme?.status || 'Unknown'}
              </TextDefault>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <TextDefault style={styles.progressLabel}>Progress</TextDefault>
              <TextDefault style={styles.progressPercentage}>{progressPercentage}%</TextDefault>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[styles.progressBarFill, { width: `${Math.min(progressPercentage, 100)}%` }]}
                />
              </View>
              <TextDefault style={styles.installmentText}>
                {paidInstallments}/{totalInstallments}
              </TextDefault>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="currency-inr" size={scale(14)} color="#fff" />
              <TextDefault style={styles.statLabel}>Total Amount</TextDefault>
              <TextDefault style={styles.statValue}>₹{totalAmount.toLocaleString()}</TextDefault>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={isDreamGoldPlan ? "wallet" : "scale-balance"}
                size={scale(14)}
                color="#fff"
              />
              <TextDefault style={styles.statLabel}>
                {isDreamGoldPlan ? 'Amount Saved' : 'Weight Saved'}
              </TextDefault>
              <TextDefault style={styles.statValue}>
                {isDreamGoldPlan ? `₹${amountReceived.toLocaleString()}` : `${savedWeight}g`}
              </TextDefault>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <View style={styles.maturityInfo}>
              <Ionicons name="calendar-outline" size={scale(14)} color="#fff" />
              <View style={styles.maturityTextContainer}>
                <TextDefault style={styles.maturityLabel}>Maturity Date</TextDefault>
                <TextDefault style={styles.maturityDate}>
                  {formatDate(scheme?.maturityDate)}
                </TextDefault>
              </View>
            </View>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel="View scheme details"
            >
              <TextDefault style={styles.detailsButtonText}>Details</TextDefault>
              <Ionicons name="arrow-forward" size={scale(14)} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Decorative Element */}
          <View style={styles.decorativeOverlay} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: scale(16),
    borderRadius: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  touchable: {
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  gradientBackground: {
    padding: scale(16),
    position: 'relative',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(16),
  },
  schemeInfo: {
    flex: 1,
    marginRight: scale(12),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  schemeName: {
    fontSize: scale(16),
    color: '#fff',
    fontWeight: '700',
    marginLeft: scale(6),
    flex: 1,
  },
  schemeCode: {
    fontSize: scale(13),
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: scale(2),
  },
  customerName: {
    fontSize: scale(12),
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },
  statusBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: scale(11),
    color: '#fff',
    fontWeight: '600',
  },
  progressSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: scale(16),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  progressLabel: {
    fontSize: scale(12),
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: scale(13),
    color: '#fff',
    fontWeight: '700',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: scale(6),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: scale(3),
    overflow: 'hidden',
    marginRight: scale(8),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: scale(3),
  },
  installmentText: {
    fontSize: scale(11),
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    minWidth: scale(40),
    textAlign: 'right',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(8),
  },
  statLabel: {
    fontSize: scale(11),
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: scale(4),
    marginBottom: scale(4),
    textAlign: 'center',
  },
  statValue: {
    fontSize: scale(14),
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: scale(8),
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maturityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  maturityTextContainer: {
    marginLeft: scale(8),
  },
  maturityLabel: {
    fontSize: scale(11),
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  maturityDate: {
    fontSize: scale(12),
    color: '#fff',
    fontWeight: '600',
    marginTop: scale(2),
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
  },
  detailsButtonText: {
    fontSize: scale(12),
    color: '#fff',
    fontWeight: '600',
    marginRight: scale(4),
  },
  decorativeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});

export default React.memo(SchemeCard);