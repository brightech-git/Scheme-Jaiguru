import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES } = appTheme;

const ProductCardSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonLoader width={SIZES.width * 0.3} height={SIZES.fontLg} style={styles.darkSkeleton} />
        <SkeletonLoader width={SIZES.width * 0.2} height={SIZES.fontLg} style={styles.lightSkeleton} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.row}>
          <SkeletonLoader width={SIZES.width * 0.25} height={SIZES.font} style={styles.mediumSkeleton} />
          <SkeletonLoader width={SIZES.width * 0.2} height={SIZES.font} style={styles.lightSkeleton} />
        </View>
        
        <View style={styles.row}>
          <SkeletonLoader width={SIZES.width * 0.3} height={SIZES.font} style={styles.mediumSkeleton} />
          <SkeletonLoader width={SIZES.width * 0.225} height={SIZES.font} style={styles.lightSkeleton} />
        </View>
        
        <View style={styles.row}>
          <SkeletonLoader width={SIZES.width * 0.35} height={SIZES.font} style={styles.mediumSkeleton} />
          <SkeletonLoader width={SIZES.width * 0.175} height={SIZES.font} style={styles.lightSkeleton} />
        </View>
      </View>
      
      <View style={styles.footer}>
        <SkeletonLoader width={SIZES.width * 0.25} height={SIZES.buttonHeight} style={styles.darkSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    marginVertical: SIZES.margin,
    marginHorizontal: SIZES.padding,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.margin,
  },
  content: {
    marginBottom: SIZES.margin,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  footer: {
    alignItems: 'center',
  },
  darkSkeleton: {
    backgroundColor: COLORS.primaryLight,
  },
  mediumSkeleton: {
    backgroundColor: COLORS.secondaryLight,
  },
  lightSkeleton: {
    backgroundColor: COLORS.borderColor,
  },
});

export default ProductCardSkeleton;