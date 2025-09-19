import { StyleSheet } from "react-native";
import appTheme from "../../utils/Theme";

<<<<<<< Updated upstream
const { COLORS, SIZES, FONTS } = appTheme;
=======
const { COLORS, FONTS, SIZES } = appTheme;
>>>>>>> Stashed changes

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  gradientOverlay: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  resendDisabled: {
    opacity: 0.5,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
<<<<<<< Updated upstream
    padding: SIZES.padding,
=======
    padding: 20,
    marginBottom: 70,
>>>>>>> Stashed changes
  },
  logoContainer: {
    marginBottom: SIZES.margin * 2,
    alignItems: "center",
  },
  logoImage: {
<<<<<<< Updated upstream
    width: 200,
    height: 200,
=======
    width: 170,
    height: 170,
>>>>>>> Stashed changes
    resizeMode: "contain",
  },
  card: {
    width: "100%",
    maxWidth: SIZES.container / 2,
    borderRadius: SIZES.radius_lg + 8,
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },

  // Typography
  title: {
<<<<<<< Updated upstream
    ...FONTS.h1,
    textAlign: "center",
=======
    // fontSize: 24,
    // fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
    ...FONTS.h2,
  },
  subtitle: {
    fontSize: 26,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 20,
    ...FONTS.body
  },
  label: {
    fontSize: 16,
    color: COLORS.title,
>>>>>>> Stashed changes
    marginBottom: 8,
    ...FONTS.heading
  },
<<<<<<< Updated upstream
  subtitle: {
    ...FONTS.body,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SIZES.margin * 2,
     fontSize: SIZES.h1,
=======
  autoDetectContainer: {
  marginBottom: 10,
  padding: 10,
  backgroundColor: COLORS.primary + '20',
  borderRadius: 8,
  alignItems: 'center',
},
autoDetectText: {
  color: COLORS.primary,
  fontSize: 12,
},
pasteButton: {
  marginBottom: 15,
  padding: 10,
  backgroundColor: COLORS.secondary + '20',
  borderRadius: 8,
  alignItems: 'center',
},
pasteText: {
  color: COLORS.secondary,
  fontSize: 14,
  fontWeight: 'bold',
},
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
    ...FONTS.subheading,
   
>>>>>>> Stashed changes
  },
  label: {
    ...FONTS.subheading,
    fontSize: SIZES.fontLg,
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  otpSubtitle: {
    ...FONTS.h3,
    fontFamily: FONTS.h2.fontFamily,
    color: COLORS.textLight,
    marginBottom: SIZES.margin,
    textAlign: "center",
     fontSize: SIZES.fontLg,
    
  },
  errorText: {
    ...FONTS.fontXs,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 10,
    textAlign: "center",
  },

  // Inputs
  inputContainer: {
    marginBottom: SIZES.margin,
  },
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius_lg,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    paddingHorizontal: SIZES.padding,
    height: 60,
  },
  countryCode: {
    ...FONTS.subheading,
    fontSize: SIZES.fontLg,
    color: COLORS.text,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    ...FONTS.fontLg,
    color: COLORS.text,
    height: "100%",
  },
  inputError: {
    borderColor: COLORS.danger,
  },

  // OTP
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.margin * 2,
    gap: SIZES.radius,
  },
  otpInputWrapper: {
    flex: 1,
    borderRadius: SIZES.radius_lg,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  otpInput: {
    width: "100%",
    height: "100%",
    ...FONTS.h3,
    textAlign: "center",
    color: COLORS.text,
  },

  // Buttons
  primaryButton: {
    borderRadius: SIZES.radius_lg,
    overflow: "hidden",
    marginBottom: SIZES.margin,
    height: 60,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    ...FONTS.body,
    color: COLORS.white,
    fontSize: SIZES.h4,
  },

  // Resend
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    ...FONTS.font,
    color: COLORS.textLight,
  },
  resendLink: {
    ...FONTS.subheading,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
<<<<<<< Updated upstream
});
=======
  resendDisabled: {
    color: COLORS.textLight,
  },
  linkText: {
    color: COLORS.title,
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    ...FONTS.subheading
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.white,
    fontSize: 16,
  },
});
>>>>>>> Stashed changes
