import { StyleSheet } from 'react-native';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES, FONTS } = appTheme;

export default StyleSheet.create({
  mainBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.9,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.padding / 1.5,
    left: SIZES.padding,
    zIndex: 1,
    padding: SIZES.padding / 1.5,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: SIZES.margin * 4,
    marginBottom: SIZES.margin,
  },
  titleText: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.h4.fontFamily,
    lineHeight: FONTS.h4.lineHeight,
    fontWeight: FONTS.heading.fontWeight,
    color: COLORS.title,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.margin,
  },
  scrollView: {
    flex: 1,
  },
  titleSpacer: {
    marginTop: SIZES.margin / 1.5,
  },
  scrollContainer: {
    paddingVertical: SIZES.margin,
    padding: SIZES.padding,
  },
  grayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding / 1.5,
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.card,
    marginVertical: SIZES.margin / 1.5,
    borderRadius: SIZES.radius_lg,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    padding: SIZES.padding / 1.5,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: SIZES.radius_lg,
  },
  cardTitle: {
    marginTop: SIZES.margin / 1.5,
    fontSize: SIZES.fontLg,
    fontFamily: FONTS.fontLg.fontFamily,
    lineHeight: FONTS.fontLg.lineHeight,
    fontWeight: FONTS.heading.fontWeight,
    color: COLORS.title,
    alignSelf: 'flex-start',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.margin / 2,
    alignSelf: 'flex-start',
  },
  cardSubtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.font.fontFamily,
    lineHeight: FONTS.font.lineHeight,
    color: COLORS.textLight,
    marginLeft: SIZES.margin / 2,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: SIZES.margin / 1.5,
    paddingHorizontal: SIZES.padding / 1.5,
  },
  tripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SIZES.padding / 1.5,
    paddingHorizontal: SIZES.padding / 2,
    borderRadius: SIZES.radius,
  },
  tripButtonText: {
    fontSize: SIZES.fontSm,
    fontFamily: FONTS.fontSm.fontFamily,
    lineHeight: FONTS.fontSm.lineHeight,
    color: COLORS.text,
    marginRight: SIZES.margin / 2,
    fontWeight: FONTS.heading.fontWeight,
  },
  title: {
    paddingHorizontal: SIZES.padding / 2,
    fontWeight: FONTS.heading.fontWeight,
    fontSize: SIZES.h5,
    fontFamily: FONTS.h5.fontFamily,
    lineHeight: FONTS.h5.lineHeight,
    color: COLORS.success,
  },
  likeIconContainer: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});