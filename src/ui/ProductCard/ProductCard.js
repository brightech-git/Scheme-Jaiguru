import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { TextDefault } from '../../components'
import appTheme from '../../utils/Theme'
import { scale } from '../../utils'

const { COLORS, SIZES, FONTS } = appTheme

function ProductCard({
  productData,
  loading,
  error,
  navigation,
  status,
  accountDetails,
  style, // ✅ new prop
}) {
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.success}
        style={{ marginTop: scale(20) }}
      />
    )
  }

  if (error) {
    return (
      <View style={{ alignItems: 'center', marginTop: scale(20) }}>
        <TextDefault style={{ color: COLORS.error }}>{error}</TextDefault>
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
      style={[styles.cardContainer, style]} // ✅ merged style
    >
      <LinearGradient
        colors={[COLORS.gradientcolor1, COLORS.gradientcolor2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          <View>
            <TextDefault style={styles.text} bold>
              {productData.groupcode} - {productData.regno}
              {isDreamGoldPlan && (
                <TextDefault style={[styles.text, { marginLeft: scale(10) }]}>
                  / ₹{accountDetails?.amount || 0}
                </TextDefault>
              )}
            </TextDefault>
            <TextDefault style={styles.text}>{productData.pname}</TextDefault>
          </View>
          <View style={styles.rightTop}>
            <TextDefault style={styles.text} bold>
              {accountDetails?.schemeSummary?.schemeName?.trim()}
            </TextDefault>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <TextDefault style={styles.text} bold>
            {status}
          </TextDefault>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: status === 'Active' ? COLORS.success : COLORS.error }
            ]}
          />
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <TextDefault style={[styles.text, styles.headerText]}>
                {isDreamGoldPlan ? 'Ins Paid' : 'Weight Saved*'}
              </TextDefault>
            </View>
            <View style={styles.headerTextContainer}>
              <TextDefault style={[styles.text, styles.headerText]}>
                Total Amount *
              </TextDefault>
            </View>
          </View>
          <View style={styles.valueRow}>
            <View style={styles.valueTextContainer}>
              <TextDefault style={[styles.text, styles.headerText]}>
                {isDreamGoldPlan
                  ? `${accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0} / ${accountDetails?.schemeSummary?.instalment || 0}`
                  : `${productData.amountWeight?.Weight || 0} g`}
              </TextDefault>
            </View>
            <View style={styles.valueTextContainer}>
              <TextDefault style={[styles.text, styles.headerText]}>
                {productData.amountWeight?.Amount || 0} ₹
              </TextDefault>
            </View>
          </View>
        </View>

        {/* Divider */}
        {/* <View style={styles.divider} /> */}

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Circle */}
          <View style={styles.circleContainer}>
            <View style={styles.weightCircle}>
              <TextDefault style={styles.weightText}>
                {isDreamGoldPlan ? 'Amount Saved' : 'Weight Saved'}
              </TextDefault>
              <TextDefault style={styles.weightValue}>
                {isDreamGoldPlan
                  ? `₹${accountDetails?.schemeSummary?.schemaSummaryTransBalance?.amtrecd || 0}`
                  : `${productData.amountWeight?.Weight || 0} g`}
              </TextDefault>
            </View>
          </View>

          {/* Maturity Date */}
          <View style={styles.dateContainer}>
            <TextDefault style={styles.maturityText}>Date of Maturity</TextDefault>
            <TextDefault style={styles.dateText}>
              {formatDate(productData.maturityDate)}
            </TextDefault>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() =>
                navigation.navigate('ProductDescription', {
                  productData,
                  status,
                  accountDetails
                })
              }
            >
              <TextDefault style={styles.payButtonText}>View</TextDefault>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() =>
                navigation.navigate('Buy', {
                  productData,
                  status,
                  accountDetails,
                  isDreamGoldPlan
                })
              }
            >
              <TextDefault style={styles.payButtonText}>Pay</TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
 cardContainer: {
  paddingTop: scale(7),
  borderRadius: SIZES.radius_lg,
  overflow: 'hidden',
  elevation: 6,
  shadowColor: COLORS.dark,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  // ❌ remove width: '100%'
},

  gradientBackground: {
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding / 2
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(20)
  },
  rightTop: {
    alignItems: 'flex-end'
  },
  statusContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: scale(-30),
    marginRight: scale(10)
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginLeft: scale(6)
  },
  centerSection: {
    paddingVertical: scale(15),
    borderRadius: SIZES.radius_sm,
    marginBottom: scale(8)
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(6)
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center'
  },
  valueTextContainer: {
    flex: 1,
    alignItems: 'center'
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  circleContainer: {
    alignItems: 'center'
  },
  weightCircle: {
    width: scale(75),
    height: scale(75),
    borderRadius: scale(75 / 2),
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(8),
    borderWidth: 2,
    borderColor: COLORS.accent
  },
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: scale(10),
    alignItems: 'center'
  },
  maturityText: {
    color: COLORS.text,
    fontSize: scale(12),
    textAlign: 'center',
    fontWeight: FONTS.heading.fontWeight
  },
  dateText: {
    color: COLORS.text,
    fontSize: scale(10),
    marginTop: scale(2),
    textAlign: 'center',
    fontWeight: FONTS.heading.fontWeight
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: scale(10),
    flexDirection: 'row',
    gap: scale(8),
    marginTop: scale(16)
  },
  payButton: {
    backgroundColor: COLORS.white,
    paddingVertical: scale(6),
    paddingHorizontal: scale(6),
    borderRadius: SIZES.radius_sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(10)
  },
  text: {
    color: COLORS.title,
    fontSize: scale(12),
    fontWeight: FONTS.heading.fontWeight
  },
  weightText: {
    color: COLORS.text,
    fontSize: scale(8),
    textAlign: 'center',
    fontWeight: FONTS.heading.fontWeight
  },
  weightValue: {
    color: COLORS.title,
    fontSize: scale(10),
    fontWeight: FONTS.heading.fontWeight,
    textAlign: 'center'
  },
  payButtonText: {
    color: COLORS.dark,
    fontSize: scale(12),
    fontWeight: FONTS.heading.fontWeight,

    padding: scale(4),
   
    borderRadius: SIZES.radius_sm
  },
  divider: {
    height: scale(2),
    backgroundColor: COLORS.text,
    borderRadius: scale(2),
    marginBottom: scale(10)
  }
})

export default ProductCard
