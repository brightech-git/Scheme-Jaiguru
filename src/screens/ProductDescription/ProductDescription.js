import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Alert,
  StyleSheet,
  Dimensions,
  Platform,
  AccessibilityInfo,
  BackHandler,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES, FONTS } = appTheme;
const { width, height } = Dimensions.get('window');

// Constants
const SCHEME_TYPES = {
  DREAM_GOLD_PLAN: 'DREAM GOLD PLAN',
};

const REFRESH_TIMEOUT = 2000;
const MAX_RECENT_PAYMENTS = 3;

// Memoized components for better performance
const ProgressBar = memo(({ percentage }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>Progress</Text>
      <Text style={styles.progressPercentage}>{percentage.toFixed(1)} %</Text>
    </View>
    <View style={styles.progressBarBackground}>
      <LinearGradient
        colors={COLORS.gradientText}
        style={[
          styles.progressBarFill,
          { width: `${Math.min(percentage, 100)}%` },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </View>
  </View>
));

const StatItem = memo(({ value, label, testID, icon }) => (
  <View 
    style={styles.statItem}
    accessible={true}
    accessibilityLabel={`${label}: ${value}`}
    testID={testID}
  >
    <View style={styles.statIconContainer}>
      <Icon name={icon} size={16} color={COLORS.primary} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
));

const InfoCard = memo(({ icon, label, value, onPress, testID }) => (
  <TouchableOpacity
    style={styles.infoCard}
    onPress={onPress}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={`${label}: ${value}`}
    testID={testID}
    activeOpacity={0.7}
  >
    <View style={styles.infoCardIcon}>
      <Icon name={icon} size={18} color={COLORS.primary} />
    </View>
    <Text style={styles.infoCardLabel}>{label}</Text>
    <Text style={styles.infoCardValue} numberOfLines={1}>{value}</Text>
  </TouchableOpacity>
));

const PaymentHistoryItem = memo(({ item, index, isLastItem, formatDate }) => (
  <View
    style={[
      styles.transactionCard,
      isLastItem && styles.lastCard,
    ]}
    accessible={true}
    accessibilityLabel={`Payment on ${formatDate(item.updateTime)}, Installment ${item.installment}, Amount ${item.amount} rupees`}
  >
    <View style={styles.transactionIcon}>
      <Icon name="check-circle" size={20} color={COLORS.success} />
    </View>
    <View style={styles.transactionDetails}>
      <Text style={styles.transactionInstallment}>
        Installment {item.installment}
      </Text>
      <Text style={styles.transactionDate}>
        {formatDate(item.updateTime)}
      </Text>
    </View>
    <View style={styles.transactionAmountContainer}>
      <Text style={styles.transactionAmount}>
        ₹ {item.amount?.toLocaleString?.('en-IN') || item.amount}
      </Text>
    </View>
  </View>
));

const LoadingState = memo(() => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Loading transactions...</Text>
  </View>
));

const EmptyState = memo(() => (
  <View style={styles.emptyState}>
    <Icon name="file-text" size={48} color={COLORS.borderColor} />
    <Text style={styles.emptyStateText}>No transactions yet</Text>
    <Text style={styles.emptyStateSubtext}>
      Your payment history will appear here once you make payments
    </Text>
  </View>
));

const SchemePassbook = ({ navigation, route }) => {
  const { productData, status, accountDetails } = route.params || {};

  // Validation
  if (!productData && !accountDetails) {
    Alert.alert('Error', 'Invalid data provided');
    navigation.goBack();
    return null;
  }

  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized calculations
  const isDreamGoldPlan = useMemo(() => 
    accountDetails?.schemeSummary?.schemeName?.trim() === SCHEME_TYPES.DREAM_GOLD_PLAN,
    [accountDetails?.schemeSummary?.schemeName]
  );

  // Enhanced date formatting with error handling
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.warn('Date formatting error:', error);
      return 'Invalid Date';
    }
  }, []);

  // Enhanced scheme statistics with better error handling
  const schemeStats = useMemo(() => {
    try {
      const totalPaid = parseFloat(productData?.amountWeight?.Amount || 0);
      const goldSaved = parseFloat(productData?.amountWeight?.Weight || 0);
      const installmentsPaid = accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0;
      const totalInstallments = accountDetails?.schemeSummary?.instalment || 0;
      const progressPercentage = totalInstallments > 0 ? (installmentsPaid / totalInstallments) * 100 : 0;

      return {
        totalPaid: isNaN(totalPaid) ? 0 : totalPaid,
        goldSaved: isNaN(goldSaved) ? 0 : goldSaved,
        installmentsPaid,
        totalInstallments,
        progressPercentage: Math.min(Math.max(progressPercentage, 0), 100),
      };
    } catch (error) {
      console.warn('Scheme stats calculation error:', error);
      return {
        totalPaid: 0,
        goldSaved: 0,
        installmentsPaid: 0,
        totalInstallments: 0,
        progressPercentage: 0,
      };
    }
  }, [productData, accountDetails]);

  // Enhanced pull-to-refresh with proper error handling
  const onRefresh = useCallback(async () => {
    if (refreshing) return; // Prevent multiple simultaneous refreshes
    
    setRefreshing(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual refresh logic
      await new Promise((resolve) => setTimeout(resolve, REFRESH_TIMEOUT));
      console.log('Data refreshed successfully');
    } catch (error) {
      console.error('Refresh error:', error);
      setError('Failed to refresh data');
      Alert.alert(
        'Refresh Failed', 
        'Unable to refresh data. Please check your connection and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Enhanced share functionality
  const handleShare = useCallback(async () => {
    try {
      const schemeName = productData?.pname || 'Gold Scheme';
      const message = `📊 My ${schemeName} Details:

💰 Total Paid: ₹${schemeStats.totalPaid.toLocaleString('en-IN')}
${isDreamGoldPlan 
  ? `📈 Progress: ${schemeStats.installmentsPaid}/${schemeStats.totalInstallments} installments` 
  : `🏆 Gold Saved: ${schemeStats.goldSaved}g`}
📅 Join Date: ${formatDate(productData?.joindate)}
🎯 Maturity Date: ${formatDate(productData?.maturityDate)}

Shared via Gold Scheme App`;

      const result = await Share.share({
        message,
        title: `${schemeName} - Passbook Details`,
        url: Platform.OS === 'ios' ? undefined : '',
      });

      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Share Failed', 'Unable to share content at the moment.');
    }
  }, [productData, schemeStats, isDreamGoldPlan, formatDate]);

  // Navigation handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleViewAllPayments = useCallback(() => {
    navigation.navigate('PaymentHistory', {
      accountDetails,
      schemeName: productData?.pname,
      productData,
    });
  }, [navigation, accountDetails, productData]);

  // Back handler for Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack();
      return true;
    });

    return () => backHandler.remove();
  }, [handleBack]);

  // Screen reader announcement for updates
  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(`Error: ${error}`);
    }
  }, [error]);

  // Memoized payment history list
  const paymentHistoryList = useMemo(() => {
    const payments = accountDetails?.paymentHistoryList || [];
    return payments.slice(0, MAX_RECENT_PAYMENTS);
  }, [accountDetails?.paymentHistoryList]);

  // Calculate average rate with safety
  const averageRate = useMemo(() => {
    const rate = schemeStats.goldSaved > 0 
      ? schemeStats.totalPaid / schemeStats.goldSaved 
      : 0;
    return isNaN(rate) ? 0 : rate.toFixed(0);
  }, [schemeStats.totalPaid, schemeStats.goldSaved]);

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Custom Header */}
        <View style={styles.customHeader}>
          <TouchableOpacity
            style={styles.backButton}
          onPress={handleBack}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          testID="back-button"
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Gold Passbook</Text>
        
        {/* <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Share passbook details"
          testID="share-button"
          activeOpacity={0.7}
        >
          <Icon name="share-alt" size={20} color={COLORS.primary} />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            title="Pull to refresh"
            titleColor={COLORS.textLight}
          />
        }
        contentContainerStyle={styles.scrollContent}
        testID="scheme-passbook-scroll"
      >
        {/* Scheme Card */}
        <View style={styles.schemeCard}>
          <LinearGradient
            colors={COLORS.gradientPrimary2}
            style={styles.schemeCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.schemeNameContainer}>
            <Text style={styles.schemeName1}>
              {productData?.pname || 'Gold Savings Scheme'}
            </Text>
            <Text style={styles.schemeName}>
              {accountDetails?.schemeSummary?.schemeName || 'Gold Savings Scheme'}
            </Text>
            </View>
            <Text style={styles.schemeStatus}>
              Status : <Text style={styles.statusActive}>Active</Text>
            </Text>
            
            {isDreamGoldPlan && (
              <ProgressBar percentage={schemeStats.progressPercentage} />
            )}
          </LinearGradient>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatItem
            value={`₹${schemeStats.totalPaid.toLocaleString('en-IN')}`}
            label="Total Invested"
            testID="total-paid-stat"
            icon="money"
          />
          
          <StatItem
            value={
              isDreamGoldPlan
                ? `${schemeStats.installmentsPaid}/${schemeStats.totalInstallments}`
                : `${schemeStats.goldSaved}g`
            }
            label={isDreamGoldPlan ? 'Installments Paid' : 'Gold Accumulated'}
            testID="secondary-stat"
            icon={isDreamGoldPlan ? "calendar-check-o" : "database"}
          />
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Scheme Details</Text>
          <View style={styles.infoCardsContainer}>
            <InfoCard
              icon="calendar"
              label="Join Date"
              value={formatDate(productData?.joindate)}
              testID="join-date-card"
            />
            
            <InfoCard
              icon="calendar-check-o"
              label="Maturity Date"
              value={formatDate(productData?.maturityDate)}
              testID="maturity-date-card"
            />
            
            {schemeStats?.goldSaved > 0 ? (
  <InfoCard
    icon="balance-scale"
    label="Gold Saved"
    value={`${schemeStats.goldSaved} g`}
    testID="gold-saved-card"
  />
) : (
    <InfoCard
      icon="credit-card"
      label="Total Paid"
      value={`₹ ${schemeStats.totalPaid}`}
      testID="total-paid-card"
    />
)}

          </View>
        </View>

        {/* Payment History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>
              Recent Payments
            </Text>
            
            {(accountDetails?.paymentHistoryList?.length || 0) > 0 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={handleViewAllPayments}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="View all payment history"
                testID="view-all-button"
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Icon
                  name="chevron-right"
                  size={12}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Payment History Content */}
          {loading ? (
            <LoadingState />
          ) : paymentHistoryList.length > 0 ? (
            <View style={styles.transactionsList}>
              {paymentHistoryList.map((item, index) => (
                <PaymentHistoryItem
                  key={`payment-${item.receiptNo || `${item.installment}-${index}`}`}
                  item={item}
                  index={index}
                  isLastItem={index === paymentHistoryList.length - 1}
                  formatDate={formatDate}
                />
              ))}
            </View>
          ) : (
            <EmptyState />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    // backgroundColor: COLORS.card,
    // borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  schemeCard: {
    margin: SIZES.margin,
    borderRadius: SIZES.radius_lg,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  schemeCardGradient: {
    padding: SIZES.padding,
  },
  schemeNameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  schemeName: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: 4,
  },
  schemeName1: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: 4,
  },
  schemeStatus: {
    ...FONTS.subheading,
    color: COLORS.outline,
    marginBottom: SIZES.margin,
    fontSize: SIZES.h6
  },
  statusActive: {
    fontWeight: '600',
    color: COLORS.warning,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    ...FONTS.h6,
    color: COLORS.white,
    fontWeight: '500',
    
  },
  progressPercentage: {
    ...FONTS.h6,
    color: COLORS.outline,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
  },
  statItem: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: COLORS.text,
    marginBottom: 4,
    ...FONTS.h5,
  },
  statLabel: {
    ...FONTS.h5,
    color: COLORS.textLight,
    textAlign: 'center',
    fontSize: SIZES.h6,
  },
  infoSection: {
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    marginBottom: SIZES.margin,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    width: (width - SIZES.margin * 2 - 12) / 3,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardLabel: {
    ...FONTS.h5,
    color: COLORS.textLight,
    textAlign: 'center',
    fontSize: SIZES.h6,
  },
  infoCardValue: {
   ...FONTS.h5,
    color: COLORS.text,
    textAlign: 'center',
    fontSize: SIZES.h6,
  },
  historySection: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.margin,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewAllText: {
    ...FONTS.fontXs,
    color: COLORS.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  transactionsList: {
    marginTop: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionInstallment: {
    ...FONTS.font,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  transactionDate: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...FONTS.font,
    fontWeight: '600',
    color: COLORS.success,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  loadingText: {
    ...FONTS.font,
    color: COLORS.textLight,
    marginTop: SIZES.margin / 1.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  emptyStateText: {
    ...FONTS.font,
    fontWeight: '500',
    color: COLORS.textLight,
    marginTop: SIZES.margin,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default memo(SchemePassbook);