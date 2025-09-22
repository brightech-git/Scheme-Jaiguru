import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { TextDefault } from '../../components'
import appTheme from '../../utils/Theme'
import { scale } from '../../utils'

const { COLORS, SIZES, FONTS } = appTheme
const { width } = Dimensions.get('window')

function ProductCard({
  productData,
  loading,
  error,
  navigation,
  status,
  accountDetails,
  style,
}) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: scale(20) }}
        />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <TextDefault style={styles.errorText}>{error}</TextDefault>
      </View>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const isDreamGoldPlan =
    accountDetails?.schemeSummary?.schemeName?.trim() === 'DREAM GOLD PLAN'

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('ProductDescription', {
          productData,
          status,
          accountDetails,
        })
      }
      style={[styles.cardContainer, style]}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <TextDefault style={styles.productCode} bold numberOfLines={1}>
              {productData.groupcode} - {productData.regno}
            </TextDefault>
            <TextDefault style={styles.productName} numberOfLines={1}>
              {productData.pname}
            </TextDefault>
          </View>
          
          <View style={styles.headerRight}>
            <View style={[styles.statusContainer, 
              status === 'Active' ? styles.statusActive : styles.statusInactive
            ]}>
              <TextDefault style={styles.statusText} bold>
                {status}
              </TextDefault>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: status === 'Active' ? COLORS.success : COLORS.error }
                ]}
              />
            </View>
            
            <TextDefault style={styles.schemeName} bold numberOfLines={1}>
              {accountDetails?.schemeSummary?.schemeName?.trim()}
            </TextDefault>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <TextDefault style={styles.statLabel}>
              {isDreamGoldPlan ? 'Ins Paid' : 'Weight Saved'}
            </TextDefault>
            <TextDefault style={styles.statValue}>
              {isDreamGoldPlan
                ? `${accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0}/${accountDetails?.schemeSummary?.instalment || 0}`
                : `${productData.amountWeight?.Weight || 0} g`}
            </TextDefault>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <TextDefault style={styles.statLabel}>
              Total Amount
            </TextDefault>
            <TextDefault style={styles.statValue}>
              ₹{productData.amountWeight?.Amount || 0}
            </TextDefault>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <TextDefault style={styles.statLabel}>
              {isDreamGoldPlan ? 'Amount Saved' : 'Weight Saved'}
            </TextDefault>
            <TextDefault style={styles.statValue}>
              {isDreamGoldPlan
                ? `₹${accountDetails?.schemeSummary?.schemaSummaryTransBalance?.amtrecd || 0}`
                : `${productData.amountWeight?.Weight || 0} g`}
            </TextDefault>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <View style={styles.maturityContainer}>
            <TextDefault style={styles.maturityLabel}>
              Maturity Date
            </TextDefault>
            <TextDefault style={styles.maturityDate}>
              {formatDate(productData.maturityDate)}
            </TextDefault>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.viewButton]}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('ProductDescription', {
                  productData,
                  status,
                  accountDetails
                })
              }}
            >
              <TextDefault style={styles.buttonText}>View</TextDefault>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.payButton]}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('Buy', {
                  productData,
                  status,
                  accountDetails,
                  isDreamGoldPlan
                })
              }}
            >
              <TextDefault style={[styles.buttonText, styles.payButtonText]}>
                Pay
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Badge for Dream Gold Plan */}
        {isDreamGoldPlan && (
          <View style={styles.premiumBadge}>
            <TextDefault style={styles.premiumBadgeText}>
              Premium: ₹{accountDetails?.amount || 0}
            </TextDefault>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    margin: scale(10),
  },
  errorText: {
    color: COLORS.error,
    fontSize: scale(14),
    textAlign: 'center',
  },
  cardContainer: {
    borderRadius: SIZES.radius_lg,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginHorizontal: scale(10),
    marginVertical: scale(8),
    // height: scale(250),
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
  headerLeft: {
    flex: 1,
    marginRight: scale(8),
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  productCode: {
    color: COLORS.white,
    fontSize: scale(16),
    marginBottom: scale(4),
    ...FONTS.heading,
  },
  productName: {
    color: COLORS.white,
    fontSize: scale(12),
    opacity: 0.9,
    ...FONTS.heading,
  },
  schemeName: {
    color: COLORS.white,
    fontSize: scale(12),
    marginTop: scale(4),
    opacity: 0.9,
    ...FONTS.heading,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: SIZES.radius_sm,
    marginBottom: scale(4),
    ...FONTS.subheading,
  },
  statusActive: {
    backgroundColor: 'rgba(46, 125, 50, 0.2)',
  },
  statusInactive: {
    backgroundColor: 'rgba(198, 40, 40, 0.2)',
  },
  statusText: {
    color: COLORS.white,
    fontSize: scale(12),
    marginRight: scale(4),
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radius,
    padding: scale(12),
    marginBottom: scale(16),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: COLORS.white,
    fontSize: scale(10),
    opacity: 0.8,
    marginBottom: scale(4),
    textAlign: 'center',
    ...FONTS.subheading,
  },
  statValue: {
    color: COLORS.white,
    fontSize: scale(14),
   ...FONTS.subheading,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: scale(4),
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maturityContainer: {
    flex: 1,
  },
  maturityLabel: {
    color: COLORS.white,
    fontSize: scale(10),
    opacity: 0.8,
    marginBottom: scale(2),
    ...FONTS.heading,
  },
  maturityDate: {
    color: COLORS.white,
    fontSize: scale(12),
    ...FONTS.subheading,

  },
  buttonGroup: {
    flexDirection: 'row',
    gap: scale(8),
  },
  button: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: SIZES.radius_sm,
    minWidth: scale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  payButton: {
    backgroundColor: COLORS.white,
  },
  buttonText: {
    fontSize: scale(12),
    fontWeight: 'bold',
    ...FONTS.subheading,
  },
  payButtonText: {
    color: COLORS.primary,
  },
  premiumBadge: {
    position: 'absolute',
    top: scale(16),
    right: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: scale(8),
    paddingVertical: scale(6),
    borderRadius: SIZES.radius_sm,
  },
  premiumBadgeText: {
    color: COLORS.primary,
    fontSize: scale(10),
    fontWeight: 'bold',
    ...FONTS.body,
  },
})

export default ProductCard