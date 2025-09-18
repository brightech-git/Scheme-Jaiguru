import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES } = appTheme;

const GoldPlansSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonLoader width={SIZES.width * 0.375} height={SIZES.fontLg} style={styles.darkSkeleton} />
        <SkeletonLoader width={SIZES.width * 0.25} height={SIZES.font} style={styles.lightSkeleton} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.planRow}>
          <SkeletonLoader width={SIZES.iconLg} height={SIZES.iconLg} style={[styles.planIcon, styles.mediumSkeleton]} />
          <View style={styles.planDetails}>
            <SkeletonLoader width={SIZES.width * 0.3} height={SIZES.fontLg} style={styles.darkSkeleton} />
            <SkeletonLoader width={SIZES.width * 0.25} height={SIZES.font} style={[styles.mediumSkeleton, styles.marginTop]} />
            <SkeletonLoader width={SIZES.width * 0.2} height={SIZES.font} style={[styles.lightSkeleton, styles.marginTop]} />
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.planRow}>
          <SkeletonLoader width={SIZES.iconLg} height={SIZES.iconLg} style={[styles.planIcon, styles.mediumSkeleton]} />
          <View style={styles.planDetails}>
            <SkeletonLoader width={SIZES.width * 0.3} height={SIZES.fontLg} style={styles.darkSkeleton} />
            <SkeletonLoader width={SIZES.width * 0.25} height={SIZES.font} style={[styles.mediumSkeleton, styles.marginTop]} />
            <SkeletonLoader width={SIZES.width * 0.2} height={SIZES.font} style={[styles.lightSkeleton, styles.marginTop]} />
          </View>
        </View>
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
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  content: {
    marginBottom: SIZES.padding,
  },
  planRow: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  planIcon: {
    borderRadius: SIZES.radius,
  },
  planDetails: {
    marginLeft: SIZES.padding,
    flex: 1,
  },
  marginTop: {
    marginTop: SIZES.margin / 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: SIZES.margin,
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

export default GoldPlansSkeleton;