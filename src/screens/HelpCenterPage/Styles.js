import { StyleSheet, Dimensions } from 'react-native';
import appTheme from '../../utils/Theme';

const { COLORS, SIZES, FONTS } = appTheme;
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  // ==== ROOT CONTAINERS ====
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // White background
  },
  scrollContainer: {
    paddingBottom: SIZES.margin, // 16
  },

  // ==== HEADER ====
  header: {
    padding: SIZES.padding, // 16
    borderBottomLeftRadius: SIZES.radius_lg * 1.5, // 24
    borderBottomRightRadius: SIZES.radius_lg * 1.5, // 24
    alignItems: 'center',
    marginBottom: SIZES.margin, // 16
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 30,
  },
  backButton: {
    padding: SIZES.padding / 2, // 8
    justifyContent: 'center',
    borderRadius: SIZES.radius_lg, // 16
    borderColor: COLORS.borderColor, // Light border
    borderWidth: 1,
    backgroundColor: COLORS.card, // Light grey background
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -SIZES.margin + 3,
  },
  title: {
    fontSize: SIZES.h3, // 24
    fontFamily: FONTS.h3.fontFamily, // DMSerif
    lineHeight: FONTS.h3.lineHeight, // 32
    fontWeight: FONTS.heading.fontWeight, // 700
    color: COLORS.primary, // White for contrast on gradient
    marginBottom: SIZES.margin / 2, // 8
  
  },
  subtitle: {
    fontSize: SIZES.fontLg, // 16
    fontFamily: FONTS.fontLg.fontFamily, // TimesNewRoman
    lineHeight: FONTS.fontLg.lineHeight, // 24
    color: COLORS.textLight, // Light grey
    opacity: 0.9,
  },

  // ==== CARDS ====
  cardsContainer: {
    paddingHorizontal: SIZES.padding, // 16
    marginBottom: SIZES.margin, // 16
  },
  card: {
    borderRadius: SIZES.radius_lg, // 16
    padding: SIZES.padding, // 16
    marginBottom: SIZES.margin, // 16
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin, // 16
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor, // Light border
    paddingBottom: SIZES.padding / 1.5, // ~10.67
  },
  iconContainer: {
    width: SIZES.h3 * 1.5, // 36
    height: SIZES.h3 * 1.5, // 36
    borderRadius: SIZES.radius_lg, // 16
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.margin / 1.5, // ~10.67
  },
  phoneIconContainer: {
    backgroundColor: COLORS.primaryLight, // Soft gold tint
  },
  emailIconContainer: {
    backgroundColor: COLORS.primaryLight, // Soft gold tint
  },
  locationIconContainer: {
    backgroundColor: COLORS.primaryLight, // Soft gold tint
  },
  cardTitle: {
    fontSize: SIZES.h5, // 18
    fontFamily: FONTS.h5.fontFamily, // DMSerif
    lineHeight: FONTS.h5.lineHeight, // 26
    fontWeight: FONTS.heading.fontWeight, // 700
    color: COLORS.primary, // Luxury gold
    ...FONTS.heading,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 1.2, // ~13.33
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor, // Light border
  },
  contactText: {
    fontSize: SIZES.fontLg, // 16
    fontFamily: FONTS.fontLg.fontFamily, // TimesNewRoman
    lineHeight: FONTS.fontLg.lineHeight, // 24
    color: COLORS.title, // Dark title color
    flex: 1,
    marginRight: SIZES.margin / 1.5, // ~10.67
    ...FONTS.subheading,
  },
  addressContainer: {
    flex: 1,
  },

  // ==== HOURS ====
  hoursContainer: {
    backgroundColor: COLORS.card, // Light grey card
    borderRadius: SIZES.radius_lg, // 16
    padding: SIZES.padding, // 16
    marginHorizontal: SIZES.padding, // 16
    marginBottom: SIZES.margin, // 16
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
  },
  hoursTitle: {
    fontSize: SIZES.h5, // 18
    fontFamily: FONTS.h5.fontFamily, // DMSerif
    lineHeight: FONTS.h5.lineHeight, // 26
    fontWeight: FONTS.heading.fontWeight, // 700
    color: COLORS.primary, // Luxury gold
    marginBottom: SIZES.margin, // 16
    textAlign: 'center',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding / 1.5, // ~10.67
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor, // Light border
  },
  hoursDay: {
    fontSize: SIZES.fontLg, // 16
    fontFamily: FONTS.fontLg.fontFamily, // TimesNewRoman
    lineHeight: FONTS.fontLg.lineHeight, // 24
    color: COLORS.title, // Dark title color
    fontWeight: FONTS.subheading.fontWeight, // 500
  },
  hoursTime: {
    fontSize: SIZES.fontLg, // 16
    fontFamily: FONTS.fontLg.fontFamily, // TimesNewRoman
    lineHeight: FONTS.fontLg.lineHeight, // 24
    color: COLORS.primary, // Luxury gold
    fontWeight: FONTS.heading.fontWeight, // 700
  },

  // ==== ACTIONS ====
  actionsContainer: {
    backgroundColor: COLORS.card, // Light grey card
    borderRadius: SIZES.radius_lg, // 16
    padding: SIZES.padding, // 16
    marginHorizontal: SIZES.padding, // 16
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
  },
  actionsTitle: {
    fontSize: SIZES.h5, // 18
    fontFamily: FONTS.h5.fontFamily, // DMSerif
    lineHeight: FONTS.h5.lineHeight, // 26
    fontWeight: FONTS.heading.fontWeight, // 700
    color: COLORS.primary, // Luxury gold
    marginBottom: SIZES.margin, // 16
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: SIZES.padding / 1.5, // ~10.67
    backgroundColor: COLORS.primaryLight, // Soft gold tint
    borderRadius: SIZES.radius, // 12
    width: width * 0.25,
  },
  actionText: {
    fontSize: SIZES.fontSm, // 13
    fontFamily: FONTS.fontSm.fontFamily, // TimesNewRoman
    lineHeight: FONTS.fontSm.lineHeight, // 18
    color: COLORS.primary, // Luxury gold
    marginTop: SIZES.margin / 2, // 8
    textAlign: 'center',
  },
});