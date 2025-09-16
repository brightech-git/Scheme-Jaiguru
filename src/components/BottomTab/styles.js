import { StyleSheet, Dimensions } from 'react-native';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES, FONTS } = appTheme;
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  footerContainer: {
    width,
    height: height * 0.08,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBtnContainer: {
    width: '25%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    marginTop: SIZES.margin / 2,
    color: COLORS.title,
    fontSize: SIZES.font,
    fontFamily: FONTS.font.fontFamily,
    lineHeight: FONTS.font.lineHeight,
    fontWeight: FONTS.heading.fontWeight,
  },
  inactiveText: {
    marginTop: SIZES.margin / 2,
    color: COLORS.textLight,
    fontSize: SIZES.fontSm,
    fontFamily: FONTS.fontSm.fontFamily,
    lineHeight: FONTS.fontSm.lineHeight,
    fontWeight: FONTS.heading.fontWeight,
  },
  profileContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileBadge: {
    width: SIZES.radius,
    height: SIZES.radius,
    position: 'absolute',
    right: '25%',
    top: 0,
    backgroundColor: COLORS.success,
    borderRadius: SIZES.radius_sm,
  },
  badgeContainer: {
    position: 'absolute',
    top: -SIZES.margin / 2,
    right: -SIZES.margin / 2,
    backgroundColor: COLORS.danger,
    borderRadius: SIZES.radius,
    height: SIZES.font,
    width: SIZES.font,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: SIZES.fontXs,
    fontFamily: FONTS.fontXs.fontFamily,
    lineHeight: FONTS.fontXs.lineHeight,
    fontWeight: FONTS.heading.fontWeight,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});