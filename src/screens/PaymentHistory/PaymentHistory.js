import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground
} from 'react-native';
import { scale } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import appTheme from '../../utils/Theme';
import { LinearGradient } from 'expo-linear-gradient';

const { COLORS, SIZES, FONTS } = appTheme;
const { width } = Dimensions.get('window');

const PaymentHistory = ({ navigation, route }) => {
  const { accountDetails, schemeName } = route.params;
  const [sortOrder, setSortOrder] = useState('desc');

  // Get payment history from accountDetails
  const paymentHistory = accountDetails?.paymentHistoryList || [];

  // Format date and time
  const formatDateTime = useCallback((dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return (
        date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' ' +
        date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    } catch (error) {
      return 'Invalid Date';
    }
  }, []);

  // Format date only
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
      return 'Invalid Date';
    }
  }, []);

  // Calculate summary statistics
  const totalAmountPaid = paymentHistory.reduce((total, payment) => {
    return total + parseFloat(payment.amount || 0);
  }, 0);

  const lastPaymentDate = paymentHistory.length > 0
    ? paymentHistory[paymentHistory.length - 1].updateTime
    : null;

  const averagePaymentAmount = paymentHistory.length > 0
    ? totalAmountPaid / paymentHistory.length
    : 0;

  // Sort payment history
  const sortedHistory = [...paymentHistory].sort((a, b) => {
    const dateA = new Date(a.updateTime || a.date);
    const dateB = new Date(b.updateTime || b.date);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Render payment history item
  const renderPaymentHistory = useCallback(({ item, index }) => {
    const isLastItem = index === paymentHistory.length - 1;
    const status = item.status?.toLowerCase() || 'paid';
    const isPaid = status === 'paid';

    return (
      <TouchableOpacity
        style={[
          styles.transactionCard,
          isLastItem && styles.lastCard,
          !isPaid && styles.pendingCard,
        ]}
        activeOpacity={0.7}
        onPress={() => {
          Alert.alert(
            'Transaction Details',
            `Installment: ${item.installment}\nAmount: ₹${item.amount}\nDate: ${formatDateTime(item.updateTime)}\nStatus: ${isPaid ? 'Paid' : 'Pending'}`,
            [{ text: 'OK' }],
          );
        }}
      >
        <View style={styles.transactionLeft}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isPaid ? COLORS.success : COLORS.warning },
          ]}>
            <Icon
              name={isPaid ? 'check-circle' : 'clock-o'}
              size={20}
              color={COLORS.text}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDate}>{formatDateTime(item.updateTime)}</Text>
            <Text style={styles.transactionInstallment}>Installment {item.installment}</Text>
            {item.receiptNo && (
              <Text style={styles.receiptNo}>Receipt: {item.receiptNo}</Text>
            )}
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            !isPaid && { color: COLORS.warning },
          ]}>
            ₹ {item.amount?.toLocaleString?.('en-IN') || item.amount}
          </Text>
          <Text style={[
            styles.statusText,
            { color: isPaid ? COLORS.success : COLORS.warning },
          ]}>
            {isPaid ? 'Paid' : 'Pending'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [formatDateTime, paymentHistory.length]);

  // Custom header component
  const CustomHeader = () => (
    <View style={styles.customHeader}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Payment History</Text>
      
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        activeOpacity={0.7}
      >
        <Icon
          name={sortOrder === 'desc' ? 'sort-amount-desc' : 'sort-amount-asc'}
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.background}
    >
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={COLORS.gradientPrimary2}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <CustomHeader />

        <View style={styles.headerCard}>
          <View style={styles.schemeIconContainer}>
          <Text style={styles.schemeName1}>
            {schemeName || 'Scheme Payment History'}
          </Text>
          <Text style={styles.schemeName}>
            {accountDetails?.schemeSummary?.schemeName || 'Scheme Payment History'}
          </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ₹ {totalAmountPaid.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.statLabel}>Total Paid</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDate(lastPaymentDate)}
              </Text>
              <Text style={styles.statLabel}>Last Payment</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ₹ {averagePaymentAmount.toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Avg. Payment</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Payment Details</Text>
          {paymentHistory.length > 0 ? (
            <FlatList
              data={sortedHistory}
              renderItem={renderPaymentHistory}
              keyExtractor={(item, index) => item.receiptNo || `${item.installment}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="file-text" size={48} color={COLORS.borderColor} />
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>
                Your payment history will appear here
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
     </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    // elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    ...FONTS.h4,
    color: COLORS.white,
    textAlign: 'center',
    flex: 1,
  },
  sortButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingBottom: SIZES.padding * 1.5,
    borderBottomLeftRadius: SIZES.radius_lg,
    borderBottomRightRadius: SIZES.radius_lg,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.margin,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  schemeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
    justifyContent: 'space-between',
  },
  schemeName: {
    ...FONTS.h5,
    color: COLORS.white,
    marginBottom: SIZES.margin,
    textAlign: 'center',
  },
  schemeName1: {
    ...FONTS.h5,
    color: COLORS.white,
    marginBottom: SIZES.margin,
    textAlign: 'center',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...FONTS.h6,
    fontWeight: '600',
    color: COLORS.iconPrimary,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.h6,
    color: COLORS.white,
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  historySection: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  historyTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    marginBottom: SIZES.margin,
  },
  listContainer: {
    paddingBottom: SIZES.padding,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin / 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pendingCard: {
    borderColor: COLORS.warning,
    backgroundColor: COLORS.primaryLight,
  },
  lastCard: {
    marginBottom: 0,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDate: {
    ...FONTS.subheading,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  transactionInstallment: {
    ...FONTS.subheading,
    color: COLORS.textLight,
  },
  receiptNo: {
    ...FONTS.subheading,
    color: COLORS.textLight,
    marginTop: 3,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...FONTS.subheading,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statusText: {
    ...FONTS.subheading,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  emptyStateText: {
    ...FONTS.font,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: SIZES.margin,
    marginBottom: SIZES.margin / 3,
  },
  emptyStateSubtext: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default PaymentHistory;