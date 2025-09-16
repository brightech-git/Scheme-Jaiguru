import { StyleSheet } from 'react-native';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES, FONTS } = appTheme;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    elevation: 4,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: SIZES.padding / 1.5,
    marginRight: SIZES.margin / 1.5,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.h3,
    fontFamily: FONTS.h3.fontFamily,
    lineHeight: FONTS.h3.lineHeight,
    fontWeight: FONTS.heading.fontWeight,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
    backgroundColor: COLORS.white,
    marginBottom: SIZES.margin / 1.5,
  },
  logoGradient: {
    width: SIZES.h1 * 2.5,
    height: SIZES.h1 * 2.5,
    borderRadius: SIZES.radius_lg * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  section: {
    backgroundColor: COLORS.white,
    marginBottom: SIZES.margin / 1.5,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    marginLeft: SIZES.margin / 1.5,
    fontSize: SIZES.h4,
    fontFamily: FONTS.h4.fontFamily,
    lineHeight: FONTS.h4.lineHeight,
    fontWeight: FONTS.heading.fontWeight,
    color: COLORS.title,
  },
  sectionContent: {
    fontSize: SIZES.font,
    fontFamily: FONTS.font.fontFamily,
    lineHeight: SIZES.h5,
    color: COLORS.textLight,
    marginBottom: SIZES.margin / 1.5,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: FONTS.heading.fontWeight,
    color: COLORS.title,
  },
  certificationBox: {
    marginTop: SIZES.margin,
  },
  certificationGradient: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificationText: {
    marginLeft: SIZES.margin,
    flex: 1,
    fontSize: SIZES.font,
    fontFamily: FONTS.font.fontFamily,
    lineHeight: SIZES.h5,
    color: COLORS.success,
  },
  featureCard: {
    marginBottom: SIZES.margin,
  },
  featureGradient: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: SIZES.h3 * 1.5,
    height: SIZES.h3 * 1.5,
    borderRadius: SIZES.radius_lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    marginLeft: SIZES.margin,
    flex: 1,
  },
  featureTitle: {
    fontSize: SIZES.h5,
    fontFamily: FONTS.h5.fontFamily,
    lineHeight: FONTS.h5.lineHeight,
    fontWeight: FONTS.heading.fontWeight,
    color: COLORS.title,
    marginBottom: SIZES.margin / 2,
  },
  featureDescription: {
    fontSize: SIZES.font,
    fontFamily: FONTS.font.fontFamily,
    lineHeight: SIZES.h5,
    color: COLORS.textLight,
  },
  missionBox: {
    marginBottom: SIZES.margin,
  },
  missionGradient: {
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius_lg,
    alignItems: 'center',
  },
  missionText: {
    fontSize: SIZES.h5,
    fontFamily: FONTS.h5.fontFamily,
    lineHeight: FONTS.h5.lineHeight,
    color: COLORS.white,
    fontWeight: FONTS.heading.fontWeight,
    textAlign: 'center',
  },
  visionBox: {
    marginBottom: SIZES.margin,
  },
  visionGradient: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  visionText: {
    marginLeft: SIZES.margin,
    flex: 1,
    fontSize: SIZES.font,
    fontFamily: FONTS.font.fontFamily,
    lineHeight: SIZES.h5,
    color: COLORS.accent,
    fontWeight: FONTS.subheading.fontWeight,
  },
  promiseBox: {
    marginTop: SIZES.margin / 1.5,
  },
  promiseGradient: {
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius_lg,
    alignItems: 'center',
  },
  promiseText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.font.fontFamily,
    lineHeight: SIZES.h5,
    textAlign: 'center',
    color: COLORS.accent,
    marginTop: SIZES.margin / 1.5,
  },
});