import { StyleSheet } from "react-native";
import appTheme from "../../utils/Theme";

const { COLORS, FONTS, SIZES } = appTheme;

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 70,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 170,
    height: 170,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
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
    marginBottom: 8,
    ...FONTS.heading
  },
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
   
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  countryCode: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 12,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  otpInputWrapper: {
    borderRadius: 8,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
  },
  otpInput: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  otpSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 12,
  },
  autoCompleteContainer: {
    marginBottom: 15,
  },
  autoCompleteLabel: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
    fontWeight: "600",
    textAlign: "center",
  },
  autoCompleteHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  autoCompleteInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "600",
  },
  manualLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: "center",
  },
  primaryButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 12,
  },
  buttonGradient: {
    padding: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  resendText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  resendLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
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