import { StyleSheet, Platform } from "react-native";
import appTheme from "../../utils/Theme";

const { COLORS, SIZES, FONTS } = appTheme;

export default StyleSheet.create({
  // ==== ROOT CONTAINERS ====
  backgroundImage: {
    flex: 1,
    resizeMode: "contain",
    // backgroundColor: COLORS.base, // Black base
  },
  keyboardContainer: {
    flex: 1,
    // backgroundColor: COLORS.base, // Always fallback black
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: SIZES.margin * 2,
  },

  // ==== LOGO SECTION ====
  logoContainer: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? SIZES.padding * 2.5 : SIZES.padding,
    paddingBottom: SIZES.padding,
    marginTop: -SIZES.margin * 2,
  },
  logoCard: {
    backgroundColor: COLORS.card, // Dark card
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: SIZES.padding / 2 },
    shadowOpacity: 0.25,
    shadowRadius: SIZES.radius_sm,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: -SIZES.margin ,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.margin / 2,
  },
  logoImage: {
    width: SIZES.width * 0.18,
    height: SIZES.height * 0.07,
    marginRight: SIZES.padding / 2,
    borderRadius: SIZES.radius_sm,
  },
  logoText: {
    ...FONTS.h2, // Bold, elegant
    color: COLORS.title, // Gold
    letterSpacing: 0.8,
  },
  subtitleText: {
    ...FONTS.subheading,
    color: COLORS.textLight, // Muted grey
    letterSpacing: 1.2,
    opacity: 0.85,
    fontSize: SIZES.h6,
  },

  // ==== HEADER ====
  contentContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 0.5,
    alignItems: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: SIZES.margin * 2,
    marginTop: SIZES.margin * 2,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.title, // Gold
    marginBottom: SIZES.base,
    textAlign: "center",
  },
  description: {
    ...FONTS.subheading,
    color: COLORS.textLight,
    textAlign: "center",
    opacity: 0.85,
    fontSize: SIZES.h5,
  },

  // ==== MPIN INPUTS ====
  mpinSection: {
    alignItems: "center",
    marginBottom: SIZES.margin * 1.5,
  },
  mpinLabel: {
    ...FONTS.subheading,
    color: COLORS.text,
    marginBottom: SIZES.margin,
    alignSelf: "flex-start",
    marginLeft: SIZES.padding / 2,
    fontSize: SIZES.h5,
  },
  mpinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.margin,
    gap: 12,
  },
  mpinInputWrapper: {
    marginHorizontal: SIZES.base / 2,
    position: "relative",
  },
  mpinInput: {
    width: SIZES.width * 0.13,
    height: SIZES.height * 0.08,
    borderWidth: 2,
    borderColor: COLORS.borderColor, // Subtle outline
    borderRadius: SIZES.radius_lg,
    backgroundColor: COLORS.outline, // Dark input
    ...FONTS.h3,
    textAlign: "center",
    color: COLORS.text,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  mpinInputFilled: {
    borderColor: COLORS.primary, // Gold border
    backgroundColor: COLORS.card, // Darker filled
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  filledIndicator: {
    position: "absolute",
    bottom: -SIZES.base,
    left: "50%",
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary, // Gold dot
  },
  attemptsText: {
    ...FONTS.fontSm,
    color: COLORS.danger, // Error red
    marginTop: SIZES.base,
    textAlign: "center",
  },

  // ==== ACTIONS (BUTTONS / LINKS) ====
  actionSection: {
    paddingBottom: Platform.OS === "ios" ? SIZES.padding * 2 : SIZES.padding,
    alignItems: "center",
  },
  forgotButton: {
    paddingVertical: SIZES.padding / 2,
    marginBottom: SIZES.margin / 2,
  },
  forgotText: {
    ...FONTS.subheading,
    color: COLORS.primary, // Gold
    fontSize: SIZES.h6,
  },

  createButton: {
    backgroundColor: COLORS.primaryLight, // Default inactive
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    alignItems: "center",
    width: SIZES.width * 0.75,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonActive: {
    backgroundColor: COLORS.primary, // Gold when active
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  createButtonLoading: {
    opacity: 0.7,
  },
  createButtonText: {
    ...FONTS.body,
    color: COLORS.textLight, // Grey when inactive
    fontSize: SIZES.h4,
  },
  createButtonTextActive: {
    color: COLORS.background, // White/gold contrast
  },
});
