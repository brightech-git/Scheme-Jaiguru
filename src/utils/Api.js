import { Platform, Alert, ToastAndroid } from 'react-native';

// API Endpoints
export const API_ENDPOINTS = {
  PHONE_SEARCH: (phoneNo) => `https://akj.brightechsoftware.com/v1/api/account/phonesearch?phoneNo=${phoneNo}`,
  ACCOUNT_DETAILS: (regno, groupcode) => `https://akj.brightechsoftware.com/v1/api/account?regno=${regno}&groupcode=${groupcode}`,
  AMOUNT_WEIGHT: (regno, groupcode) => `https://akj.brightechsoftware.com/v1/api/getAmountWeight?REGNO=${regno}&GROUPCODE=${groupcode}`,
  TODAY_RATE: 'https://akj.brightechsoftware.com/v1/api/account/todayrate',
  SCHEMES: 'https://akj.brightechsoftware.com/v1/api/member/scheme',
};

// Default Headers for API Calls
export const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  COIN_FLIP_DURATION: 2000,
  FADE_IN_DURATION: 800,
  SILVER_DELAY: 500,
  STAGGER_DELAY: 100,
};

// Toast Utility with Enhanced UX
export const showToast = (message, type = 'info', duration = 'SHORT') => {
  if (Platform.OS === 'android') {
    const toastDuration = duration === 'LONG' ? ToastAndroid.LONG : ToastAndroid.SHORT;
    ToastAndroid.show(message, toastDuration);
  } else {
    const alertStyle = type === 'error' ? 'destructive' : 'default';
    Alert.alert('', message, [{ text: 'OK', style: alertStyle }]);
  }
};

// Enhanced Error Handler
export const handleError = (error, context = '') => {
  const errorMessage = error?.message || 'An unexpected error occurred';
  const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;
  
  console.error('Error:', {
    context,
    error: errorMessage,
    stack: error?.stack,
    timestamp: new Date().toISOString(),
  });
  
  showToast(fullMessage, 'error');
  return fullMessage;
};

// API Request Helper with Enhanced Error Handling
export const makeAPIRequest = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    timeout: 10000, // 10 seconds
  };

  const requestOptions = { ...defaultOptions, ...options };

  try {
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);

    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw error;
  }
};

// Date Formatting Utilities
export const formatDateTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedTime = `${hours > 12 ? hours - 12 : hours === 0 ? 12 : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  } ${hours >= 12 ? 'PM' : 'AM'}`;
  
  const formattedDate = `${day < 10 ? '0' + day : day}-${
    month < 10 ? '0' + month : month
  }-${year}`;

  return `Rate updated on ${formattedTime} ${formattedDate}`;
};

export const formatCurrency = (amount, currency = '₹') => {
  if (amount === null || amount === undefined) return '---';
  
  // Format number with Indian numbering system
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    maximumFractionDigits: 2,
  });
  
  return `${currency}${formatter.format(amount)}`;
};

// Validation Utilities
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
};

export const validateResponseData = (data, requiredFields = []) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid response data' };
  }

  for (const field of requiredFields) {
    if (!(field in data)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  return { valid: true };
};

// Business Logic Helpers
export const calculateSchemeStatus = (maturityDate, joinDate = null) => {
  if (!maturityDate) return 'Deactive';
  
  const maturity = new Date(maturityDate);
  const today = new Date();
  
  if (isNaN(maturity.getTime())) return 'Deactive';
  
  return maturity > today ? 'Active' : 'Matured';
};

export const processProductData = (phoneSearchData) => {
  if (!Array.isArray(phoneSearchData) || phoneSearchData.length === 0) {
    return { valid: [], invalid: [], errors: ['No data to process'] };
  }

  const valid = [];
  const invalid = [];
  const errors = [];

  phoneSearchData.forEach((item, index) => {
    try {
      const status = calculateSchemeStatus(item.maturitydate, item.joindate);
      const processedItem = {
        ...item,
        status,
        processedAt: new Date().toISOString(),
      };

      if (status !== 'Deactive') {
        valid.push(processedItem);
      } else {
        invalid.push(processedItem);
      }
    } catch (error) {
      errors.push(`Error processing item ${index}: ${error.message}`);
    }
  });

  return { valid, invalid, errors };
};

// Storage Utilities with Error Handling
export const getStorageItem = async (key, defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.warn(`Error getting storage item ${key}:`, error);
    return defaultValue;
  }
};

export const setStorageItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error setting storage item ${key}:`, error);
    return false;
  }
};

// Performance Monitoring
export const performanceLogger = {
  start: (operation) => {
    const startTime = Date.now();
    return {
      end: () => {
        const duration = Date.now() - startTime;
        console.log(`[Performance] ${operation}: ${duration}ms`);
        return duration;
      }
    };
  }
};

// Retry Utility for Failed Requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) break;
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      console.log(`Retry attempt ${i + 1}/${maxRetries} after ${waitTime}ms`);
    }
  }
  
  throw lastError;
};

// Constants for UI
export const UI_CONSTANTS = {
  TABLET_BREAKPOINT: 768,
  MAX_CONTAINER_WIDTH: 800,
  SCROLL_THROTTLE: 16,
  ANIMATION_SPRING_CONFIG: {
    tension: 100,
    friction: 8,
  },
  LOADING_SKELETON_COUNT: 3,
};

// Accessibility Helpers
export const getAccessibilityLabel = (type, value, unit = '') => {
  switch (type) {
    case 'rate':
      return `${type} rate is ${value} rupees ${unit}`;
    case 'scheme':
      return `Scheme ${value}`;
    case 'button':
      return `${value} button`;
    default:
      return value;
  }
};

// Device Detection
export const isTabletDevice = (width) => width > UI_CONSTANTS.TABLET_BREAKPOINT;

// Export all utilities as default object
const utils = {
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  ANIMATION_CONFIG,
  UI_CONSTANTS,
  showToast,
  handleError,
  makeAPIRequest,
  formatDateTime,
  formatCurrency,
  validatePhoneNumber,
  validateResponseData,
  calculateSchemeStatus,
  processProductData,
  getStorageItem,
  setStorageItem,
  performanceLogger,
  retryRequest,
  getAccessibilityLabel,
  isTabletDevice,
};

export default utils;