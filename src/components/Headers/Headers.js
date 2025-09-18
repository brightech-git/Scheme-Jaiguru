import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import  appTheme  from '../../utils/Theme';
import { scale } from '../../utils'

// Destructure theme constants
const { COLORS, SIZES, FONTS, ICONS } = appTheme;
const { width, height } = Dimensions.get('screen');

const styles = {
  container: {
    width: width,
    height: SIZES.headerHeight || 40, // Use theme size or fallback
    // backgroundColor: COLORS.surface,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // paddingHorizontal: SIZES.padding,
    // borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    marginBottom: scale(20),
  },
  subContainer: {
    width: '100%',
    height: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingLeft: SIZES.marginSmall,
  },
  leftContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // left: SIZES.padding,
  },
  headerText: {
    ...FONTS.h4,
    color: COLORS.title,
    textAlign: 'center',
    position: 'absolute',
    left: '45%',
    transform: [{ translateX: -width * 0.15 }],
    maxWidth: width * 0.6, // Ensure text doesn't overflow
  },
  circle: {
    width: SIZES.iconSize || 50,
    height: SIZES.iconSize || 50,
    borderRadius: (SIZES.iconSize || 50) / 2,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
};

function BackHeader(props) {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        {/* Back Arrow Inside Circle */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.leftContainer}
          onPress={() => props.backPressed()}
        >
          <View style={styles.circle}>
            <MaterialIcons
              name="chevron-left"
              size={ICONS.lg || 28}
              color={COLORS.iconPrimary}
            />
          </View>
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerText}>
          {props.title}
        </Text>
      </View>
    </View>
  );
}


function HeaderRightText(props) {
  return (
    <View style={styles.container}>
      <View style={[styles.subContainer, { justifyContent: 'space-between' }]}>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            activeOpacity={0}
            onPress={() => props.backPressed()}>
            <Ionicons name="ios-arrow-back" size={30} />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.headerText}>
            {props.title}
          </Text>
        </View>
        <Text style={styles.rightTitle}>New Address</Text>
      </View>
    </View>
  )
}
export { BackHeader, HeaderRightText }
