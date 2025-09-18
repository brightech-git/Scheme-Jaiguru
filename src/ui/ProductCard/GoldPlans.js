import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextDefault } from '../../components';
import { alignment, scale } from '../../utils';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES, FONTS } = appTheme;

function GoldPlan(props) {
  const { schemeId, schemeName, description = 'No description available' } = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={[styles.cardContainer, props.styles]}
      activeOpacity={0.7}
    >
      {/* 🔥 Gradient Background */}
      <LinearGradient
        colors={COLORS.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.rightTop}>
            <TextDefault style={styles.schemeNameText} bold>
              {schemeName}
            </TextDefault>
          </View>
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          <TextDefault style={styles.descriptionText}>
            {description}
          </TextDefault>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.knowMoreButton}
            onPress={() => navigation.navigate('KnowMore', { schemeId })}
          >
            <TextDefault style={styles.knowMoreButtonText}>Know More</TextDefault>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => navigation.navigate('AddNewMember', { schemeId })}
          >
            <TextDefault style={styles.joinButtonText}>Join Scheme</TextDefault>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: SIZES.radius_lg,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  gradientBackground: {
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.margin,
  },
  rightTop: {
    alignItems: 'flex-end',
  },
  centerSection: {
    marginBottom: SIZES.margin / 2,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.margin,
  },
  knowMoreButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius_sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flex: 1,
    marginRight: SIZES.margin / 2,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius_sm,
    flex: 1,
    marginLeft: SIZES.margin / 2,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  schemeNameText: {
    ...FONTS.h5,
    color: COLORS.white,
    textAlign: 'right',
  },
  descriptionText: {
    ...FONTS.font,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.margin,
  },
  knowMoreButtonText: {
    ...FONTS.h5,
    color: COLORS.notification,
    fontWeight: '600',
    textAlign: 'center',
  },
  joinButtonText: {
    ...FONTS.h5,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GoldPlan;