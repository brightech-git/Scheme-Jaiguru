// GlobalStyles.js - Complete Design System for React Native
// Consolidated design tokens and styles for consistent UI

import { Dimensions, Platform, StatusBar } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';

// ==========================================
// COLORS - Organized Color Palette
// ==========================================
export const Colors = {
  // ============ PRIMARY BRAND COLORS ============
  primary: {
    main: '#9f5bff',           // Main brand color
    light: '#b87fff',          // Lighter variant
    dark: '#7c47cc',           // Darker variant
    contrast: '#ffffff',       // Text on primary
  },

  secondary: {
    main: '#D0AD8A',           // Secondary brand color
    light: '#e6c4a6',          // Lighter variant
    dark: '#b8946d',           // Darker variant
    contrast: '#ffffff',       // Text on secondary
  },

  accent: {
    main: '#F48B98',           // Accent/pink color
    light: '#f7a5b2',          // Lighter variant
    dark: '#e6677a',           // Darker variant
    contrast: '#ffffff',       // Text on accent
  },

  // ============ SEMANTIC COLORS ============
  success: {
    main: '#36c07e',           // Success green
    light: '#5fd49b',          // Light success
    dark: '#2aa066',           // Dark success
    background: '#e8f7f0',     // Success background
    contrast: '#ffffff',       // Text on success
  },

  warning: {
    main: '#Ffd700',           // Warning yellow/gold
    light: '#fff44d',          // Light warning
    dark: '#e6c200',           // Dark warning
    background: '#fffacd',     // Warning background
    contrast: '#000000',       // Text on warning
  },

  error: {
    main: '#ff4747',           // Error red
    light: '#ff6b6b',          // Light error
    dark: '#e63636',           // Dark error
    background: '#ffebee',     // Error background
    contrast: '#ffffff',       // Text on error
  },

  info: {
    main: '#6178DE',           // Info blue
    light: '#8196e8',          // Light info
    dark: '#4a5fc7',           // Dark info
    background: '#e8f0ff',     // Info background
    contrast: '#ffffff',       // Text on info
  },

  // ============ NEUTRAL COLORS ============
  neutral: {
    white: '#ffffff',          // Pure white
    black: '#000000',          // Pure black
    gray50: '#f9fafb',         // Lightest gray
    gray100: '#f3f4f6',        // Very light gray
    gray200: '#e5e7eb',        // Light gray
    gray300: '#d1d5db',        // Medium light gray
    gray400: '#9ca3af',        // Medium gray
    gray500: '#6b7280',        // True gray
    gray600: '#4b5563',        // Medium dark gray
    gray700: '#374151',        // Dark gray
    gray800: '#1f2937',        // Very dark gray
    gray900: '#111827',        // Almost black
  },

  // ============ TEXT COLORS ============
  text: {
    primary: '#212121',        // Main text color
    secondary: '#4A4A4A',      // Secondary text
    tertiary: '#949393',       // Tertiary text
    disabled: '#cccccc',       // Disabled text
    inverse: '#ffffff',        // Text on dark backgrounds
    link: '#6178DE',           // Link color
    placeholder: '#cccccc',    // Placeholder text
  },

  // ============ BACKGROUND COLORS ============
  background: {
    default: '#F7F7F7',        // Default background
    paper: '#ffffff',          // Card/paper background
    dark: '#EAEAEA',           // Dark variant
    overlay: 'rgba(52, 52, 52, 0.9)',  // Modal overlay
    disabled: '#f5f5f5',       // Disabled background
  },

  // ============ BORDER COLORS ============
  border: {
    light: '#f0f0f0',          // Light borders
    medium: '#D8D8D8',         // Medium borders
    dark: '#949393',           // Dark borders
    focus: '#6178DE',          // Focus state
    error: '#ff4747',          // Error state
  },

  // ============ SOCIAL COLORS ============
  social: {
    google: '#DC4E41',         // Google red
    facebook: '#3B5998',       // Facebook blue
  },

  // ============ LEGACY COLORS (for backward compatibility) ============
  legacy: {
    Zipsii_color: '#A60F93',
    btncolor: '#Ffd700',
    lightpink: '#ffe3f0',
    iconColor: '#F48B98',
    spinnerColor: '#D0AD8A',
    buttonBackground: '#D0AD8A',
    blueButton: '#6178DE',
    selected: '#33cc33',
    messageBackground: 'rgba(52, 52, 52, .9)',
    errorColor: 'rgba(255, 0, 0, 0.81)',
    radioColor: '#FFF',
    radioOuterColor: '#D0AD8A',
    lightBrown: '#fcead9',
    headerbackground: '#FFF',
    headerText: '#000',
    startColor: '#D0AD8A',
    startOutlineColor: '#D0AD8A',
    backgroundcolor: 'rgba(239, 210, 250, 0.9)',
    ButtonColor: 'rgb(238, 124, 48)',
    headercolor: 'rgba(231, 121, 47, 0.85)',
  },
};

// ==========================================
// TYPOGRAPHY - Font Families & Sizes
// ==========================================
export const Typography = {
  // ============ FONT FAMILIES ============
  fonts: {
    // Primary font family
    primary: {
      thin: 'Poppins-Thin',
      light: 'Poppins-Light',
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
      extraBold: 'Poppins-ExtraBold',
    },
    
    // Secondary font family
    secondary: {
      light: 'Gilroy-Light',
      regular: 'Gilroy-Regular',
      medium: 'Gilroy-Medium',
      semiBold: 'Gilroy-SemiBold',
      bold: 'Gilroy-Bold',
      extraBold: 'Gilroy-ExtraBold',
    },
    
    // Accent fonts
    accent: {
      inter: {
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        extraBold: 'Inter-ExtraBold',
      },
      sora: {
        regular: 'Sora-Regular',
        semiBold: 'Sora-SemiBold',
      },
      crimson: 'CrimsonText-Regular',
      radley: 'Radley-Regular',
    },
    
    // System fonts fallback
    system: IS_IOS ? 'San Francisco' : 'Roboto',
  },

  // ============ FONT SIZES ============
  sizes: {
    // Display sizes (57-36px)
    display: {
      large: 57,    // Hero text
      medium: 45,   // Large headlines
      small: 36,    // Medium headlines
    },
    
    // Headline sizes (32-24px)
    headline: {
      large: 32,    // H1 - Page titles
      medium: 28,   // H2 - Section titles
      small: 24,    // H3 - Subsection titles
    },
    
    // Title sizes (22-14px)
    title: {
      large: 22,    // Large titles
      medium: 16,   // Medium titles
      small: 14,    // Small titles
    },
    
    // Body text sizes (16-12px)
    body: {
      large: 16,    // Large body text
      medium: 14,   // Standard body text
      small: 12,    // Small body text
    },
    
    // Label sizes (14-11px)
    label: {
      large: 14,    // Large labels
      medium: 12,   // Standard labels
      small: 11,    // Small labels
    },
    
    // Caption sizes (12-10px)
    caption: {
      large: 12,    // Large captions
      medium: 11,   // Standard captions
      small: 10,    // Small captions
    },
    
    // Specialized sizes
    button: {
      large: 16,
      medium: 14,
      small: 12,
      tiny: 10,
    },
    
    input: 16,      // Input text (iOS minimum for no zoom)
    
    // Legacy sizes (for backward compatibility)
    legacy: {
      size_smi: 13,
      buttone16pxS_size: 18,
      textStyleSmallTextBold_size: 14,
      textStyleSmallerTextSemiBold_size: 11,
      size_6xl: 25,
      size_3xs: 10,
      size_xs: 12,
      textStyleNormalTextBold_size: 16,
      textStyleLargeTextBold_size: 20,
      size_6xs: 7,
      textStyleSmallerTextSmallLabel_size: 8,
    },
  },

  // ============ FONT WEIGHTS ============
  weights: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },

  // ============ LINE HEIGHTS ============
  lineHeights: {
    tight: 1.2,     // Headlines
    normal: 1.4,    // Body text
    relaxed: 1.6,   // Long content
    loose: 1.8,     // Accessibility
  },
};

// ==========================================
// SPACING - Consistent spacing system
// ==========================================
export const Spacing = {
  // Base spacing unit (8px)
  unit: 8,
  
  // Spacing scale
  xs: 4,      // 0.5 units
  sm: 8,      // 1 unit
  md: 16,     // 2 units
  lg: 24,     // 3 units
  xl: 32,     // 4 units
  xxl: 48,    // 6 units
  xxxl: 64,   // 8 units
  
  // Semantic spacing
  section: 32,        // Between sections
  component: 16,      // Between components
  element: 8,         // Between elements
  
  // Legacy padding values
  legacy: {
    p_6xs: 7,
    p_10xs: 3,
    p_xl: 20,
    p_13xl: 32,
    p_3xs: 10,
    p_11xl: 30,
    p_8xs: 5,
    p_xs: 12,
    p_5xs: 8,
    p_9xs_5: 4,
  },
};

// ==========================================
// BORDER RADIUS - Consistent border radius
// ==========================================
export const BorderRadius = {
  none: 0,
  xs: 4,      // Small radius
  sm: 8,      // Small-medium radius
  md: 12,     // Medium radius
  lg: 16,     // Large radius
  xl: 20,     // Extra large radius
  xxl: 24,    // 2X large radius
  full: 9999, // Fully rounded (pills)
  
  // Component-specific
  button: 8,
  card: 12,
  input: 8,
  modal: 16,
  
  // Legacy border radius values
  legacy: {
    br_mini: 15,
    br_11xl: 30,
    br_xl: 20,
    br_smi: 13,
    br_3xs: 10,
    br_5xs: 8,
    br_9xs: 4,
    br_sm: 14,
    br_6xs: 7,
    br_12xs_5: 1,
    br_31xl: 50,
    br_lgi: 19,
    br_xs: 12,
    br_10xs_5: 3,
  },
};

// ==========================================
// SHADOWS - Elevation system
// ==========================================
export const Shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  xs: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  
  xl: {
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
};

// ==========================================
// LAYOUT - Layout-related values
// ==========================================
export const Layout = {
  // Screen dimensions
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  
  // Status bar
  statusBar: {
    height: IS_IOS ? (SCREEN_HEIGHT >= 812 ? 44 : 20) : StatusBar.currentHeight || 0,
  },
  
  // Safe areas (approximate)
  safeArea: {
    top: IS_IOS ? (SCREEN_HEIGHT >= 812 ? 44 : 20) : StatusBar.currentHeight || 0,
    bottom: IS_IOS ? (SCREEN_HEIGHT >= 812 ? 34 : 0) : 0,
  },
  
  // Container widths
  container: {
    xs: 320,
    sm: 768,
    md: 1024,
    lg: 1200,
    xl: 1400,
  },
  
  // Component sizes
  button: {
    height: {
      small: 32,
      medium: 40,
      large: 48,
      xlarge: 56,
    },
  },
  
  input: {
    height: {
      small: 36,
      medium: 44,
      large: 52,
    },
  },
  
  header: {
    height: IS_IOS ? 44 : 56,
  },
  
  tabBar: {
    height: IS_IOS ? 83 : 56,
  },
};

// ==========================================
// COMPONENT STYLES - Pre-defined component styles
// ==========================================
export const ComponentStyles = {
  // ============ TEXT STYLES ============
  text: {
    // Headlines
    h1: {
      fontSize: Typography.sizes.headline.large,
      fontFamily: Typography.fonts.primary.bold,
      color: Colors.text.primary,
      lineHeight: Typography.sizes.headline.large * Typography.lineHeights.tight,
    },
    
    h2: {
      fontSize: Typography.sizes.headline.medium,
      fontFamily: Typography.fonts.primary.semiBold,
      color: Colors.text.primary,
      lineHeight: Typography.sizes.headline.medium * Typography.lineHeights.tight,
    },
    
    h3: {
      fontSize: Typography.sizes.headline.small,
      fontFamily: Typography.fonts.primary.semiBold,
      color: Colors.text.primary,
      lineHeight: Typography.sizes.headline.small * Typography.lineHeights.tight,
    },
    
    // Body text
    bodyLarge: {
      fontSize: Typography.sizes.body.large,
      fontFamily: Typography.fonts.primary.regular,
      color: Colors.text.primary,
      lineHeight: Typography.sizes.body.large * Typography.lineHeights.normal,
    },
    
    body: {
      fontSize: Typography.sizes.body.medium,
      fontFamily: Typography.fonts.primary.regular,
      color: Colors.text.primary,
      lineHeight: Typography.sizes.body.medium * Typography.lineHeights.normal,
    },
    
    bodySmall: {
      fontSize: Typography.sizes.body.small,
      fontFamily: Typography.fonts.primary.regular,
      color: Colors.text.secondary,
      lineHeight: Typography.sizes.body.small * Typography.lineHeights.normal,
    },
    
    // Special text
    caption: {
      fontSize: Typography.sizes.caption.medium,
      fontFamily: Typography.fonts.primary.regular,
      color: Colors.text.tertiary,
      lineHeight: Typography.sizes.caption.medium * Typography.lineHeights.normal,
    },
    
    link: {
      fontSize: Typography.sizes.body.medium,
      fontFamily: Typography.fonts.primary.medium,
      color: Colors.text.link,
      textDecorationLine: 'underline',
    },
    
    error: {
      fontSize: Typography.sizes.caption.medium,
      fontFamily: Typography.fonts.primary.regular,
      color: Colors.error.main,
    },
  },

  // ============ BUTTON STYLES ============
  button: {
    // Primary button
    primary: {
      backgroundColor: Colors.primary.main,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.button,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: Layout.button.height.medium,
      ...Shadows.sm,
    },
    
    primaryText: {
      fontSize: Typography.sizes.button.medium,
      fontFamily: Typography.fonts.primary.semiBold,
      color: Colors.primary.contrast,
    },
    
    // Secondary button
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: Colors.primary.main,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.button,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: Layout.button.height.medium,
    },
    
    secondaryText: {
      fontSize: Typography.sizes.button.medium,
      fontFamily: Typography.fonts.primary.semiBold,
      color: Colors.primary.main,
    },
    
    // Text button
    text: {
      backgroundColor: 'transparent',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    textButtonText: {
      fontSize: Typography.sizes.button.medium,
      fontFamily: Typography.fonts.primary.medium,
      color: Colors.primary.main,
    },
  },

  // ============ INPUT STYLES ============
  input: {
    container: {
      marginBottom: Spacing.md,
    },
    
    label: {
      fontSize: Typography.sizes.label.medium,
      fontFamily: Typography.fonts.primary.medium,
      color: Colors.text.primary,
      marginBottom: Spacing.xs,
    },
    
    field: {
      borderWidth: 1,
      borderColor: Colors.border.medium,
      borderRadius: BorderRadius.input,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
      fontSize: Typography.sizes.input,
      fontFamily: Typography.fonts.primary.regular,
      color: Colors.text.primary,
      backgroundColor: Colors.background.paper,
      minHeight: Layout.input.height.medium,
    },
    
    fieldFocused: {
      borderColor: Colors.border.focus,
      ...Shadows.sm,
    },
    
    fieldError: {
      borderColor: Colors.border.error,
    },
    
    placeholder: {
      color: Colors.text.placeholder,
    },
    
    error: {
      fontSize: Typography.sizes.caption.small,
      fontFamily: Typography.fonts.primary.regular,
      color: Colors.error.main,
      marginTop: Spacing.xs,
    },
  },

  // ============ CARD STYLES ============
  card: {
    container: {
      backgroundColor: Colors.background.paper,
      borderRadius: BorderRadius.card,
      padding: Spacing.lg,
      ...Shadows.md,
    },
    
    title: {
      fontSize: Typography.sizes.title.medium,
      fontFamily: Typography.fonts.primary.semiBold,
      color: Colors.text.primary,
      marginBottom: Spacing.sm,
    },
    
    content: {
      fontSize: Typography.sizes.body.medium,
      fontFamily: Typography.fonts.primary.regular,
      color: Colors.text.secondary,
      lineHeight: Typography.sizes.body.medium * Typography.lineHeights.normal,
    },
  },

  // ============ LAYOUT STYLES ============
  layout: {
    container: {
      flex: 1,
      backgroundColor: Colors.background.default,
    },
    
    safeArea: {
      flex: 1,
      paddingTop: Layout.safeArea.top,
      paddingBottom: Layout.safeArea.bottom,
    },
    
    content: {
      flex: 1,
      padding: Spacing.lg,
    },
    
    section: {
      marginBottom: Spacing.section,
    },
    
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    column: {
      flexDirection: 'column',
    },
    
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    spaceBetween: {
      justifyContent: 'space-between',
    },
    
    spaceAround: {
      justifyContent: 'space-around',
    },
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
export const Helpers = {
  // Responsive font scaling
  responsiveFontSize: (size, factor = 0.3) => {
    const scale = SCREEN_WIDTH / 375; // Base design width
    const newSize = size + (scale - 1) * size * factor;
    return Math.max(size * 0.8, Math.min(newSize, size * 1.3));
  },
  
  // Get platform-specific value
  platformValue: (ios, android) => IS_IOS ? ios : android,
  
  // Create consistent spacing
  spacing: (multiplier) => Spacing.unit * multiplier,
  
  // Merge styles
  mergeStyles: (...styles) => Object.assign({}, ...styles),
  
  // Get color with opacity
  colorWithOpacity: (color, opacity) => {
    if (color.includes('rgba')) return color;
    if (color.includes('rgb')) {
      return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
    }
    // For hex colors
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
};

// ==========================================
// THEME OBJECT - Main export
// ==========================================
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  components: ComponentStyles,
  helpers: Helpers,
};

// ==========================================
// DEFAULT EXPORT
// ==========================================
export default Theme;