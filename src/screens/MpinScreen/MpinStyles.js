import { StyleSheet, Platform } from 'react-native';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES, FONTS } = appTheme;

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: SIZES.margin * 2,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? SIZES.padding * 2.5 : SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  logoCard: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    borderRadius: SIZES.radius_lg,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: SIZES.base },
    shadowOpacity: 0.1,
    shadowRadius: SIZES.radius_sm,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
  },
  logoImage: {
    width: SIZES.width * 0.18,
    height: SIZES.height * 0.07,
    marginRight: SIZES.base,
    borderRadius: SIZES.radius_sm,
  },
  logoText: {
    ...FONTS.body,
    color: COLORS.title,
    letterSpacing: 0.8,
    fontSize: SIZES.h1,
  },
  subtitleText: {
    ...FONTS.subheading,
    color: COLORS.textLight,
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  contentContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 0.5,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SIZES.margin * 2,
    marginTop: SIZES.margin * 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.title,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  description: {
    ...FONTS.subheading,
    color: COLORS.textLight,
    textAlign: 'center',
    opacity: 0.8,
    fontSize: SIZES.h5,
    
  },
  mpinSection: {
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  mpinLabel: {
    ...FONTS.subheading,
    color: COLORS.text,
    marginBottom: SIZES.margin,
    alignSelf: 'flex-start',
    marginLeft: SIZES.base,
     fontSize: SIZES.h5,
  },
  mpinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.margin,
     gap: 10,
  },
  mpinInputWrapper: {
    marginHorizontal: SIZES.base,
    position: 'relative',
  },
  mpinInput: {
    width: SIZES.width * 0.13,
    height: SIZES.height * 0.08,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    borderRadius: SIZES.radius_lg,
    ...FONTS.h3,
    backgroundColor: COLORS.input,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    textAlign: 'center',
    color: COLORS.text,
   
  },
  mpinInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    
  },
  filledIndicator: {
    position: 'absolute',
    bottom: -SIZES.base,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    
  },
  attemptsText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
    marginTop: SIZES.base,
  },
  actionSection: {
    paddingBottom: Platform.OS === 'ios' ? SIZES.padding : SIZES.padding / 2,
    alignItems: 'center',
  },
  forgotButton: {
    paddingVertical: SIZES.padding / 2,
    marginBottom: SIZES.margin / 2,
  },
  forgotText: {
    ...FONTS.subheading,
    color: COLORS.primary,
    fontSize: SIZES.h6,
  },
  createButton: {
    backgroundColor: COLORS.borderColor,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: SIZES.width * 0.75,
  },
  createButtonActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  createButtonLoading: {
    opacity: 0.7,
  },
  createButtonText: {
    ...FONTS.body,
    color: COLORS.textLight,
    fontSize: SIZES.h4,
  },
  createButtonTextActive: {
    color: COLORS.white,
  },
});
