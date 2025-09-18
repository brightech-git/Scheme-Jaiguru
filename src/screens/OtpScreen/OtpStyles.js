import { StyleSheet } from "react-native";
import appTheme from "../../utils/Theme";

const { COLORS } = appTheme;

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
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
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
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
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
    color: COLORS.primary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
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