import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  Vibration,
  BackHandler,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTab } from '../../components';

const { width, height } = Dimensions.get('window');

const SupportPage = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schemeName: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  
  // Input refs for better control
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const schemeInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  
  // Form validation with real-time feedback
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!value || value.trim().length === 0) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value || value.trim().length === 0) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'schemeName':
        if (!value || value.trim().length === 0) {
          newErrors.schemeName = 'Scheme name is required';
        } else {
          delete newErrors.schemeName;
        }
        break;
      case 'description':
        if (!value || value.trim().length === 0) {
          newErrors.description = 'Description is required';
        } else if (value.trim().length < 10) {
          newErrors.description = 'Please provide more details (min 10 characters)';
        } else {
          delete newErrors.description;
        }
        break;
    }
    
    setErrors(newErrors);
    calculateProgress({ ...formData, [field]: value });
  };

  const calculateProgress = (data) => {
    const fields = ['name', 'email', 'schemeName', 'description'];
    const filledFields = fields.filter(field => 
      data[field] && data[field].toString().trim().length > 0
    ).length;
    const progress = (filledFields / fields.length) * 100;
    setFormProgress(progress);
    
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleInputChange = (field, value) => {
    // Ensure we're working with a string value
    const stringValue = value ? value.toString() : '';
    
    setFormData(prev => ({
      ...prev,
      [field]: stringValue
    }));
    
    // Validate after a short delay to avoid excessive validation calls
    setTimeout(() => {
      validateField(field, stringValue);
    }, 100);
  };

  const handleGoBack = () => {
    if (formProgress > 10) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { 
            text: 'Stay', 
            style: 'cancel' 
          },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              if (navigation && navigation.goBack) {
                navigation.goBack();
              }
            }
          }
        ]
      );
    } else {
      if (navigation && navigation.goBack) {
        navigation.goBack();
      }
    }
  };

  const shakeError = () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'schemeName', 'description'];
    let hasErrors = false;
    
    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });
    
    // Check if there are any errors after validation
    Object.keys(errors).forEach(key => {
      if (errors[key]) {
        hasErrors = true;
      }
    });
    
    if (hasErrors || formProgress < 100) {
      shakeError();
      return false;
    }
    return true;
  };

  const showSuccessAnimation = () => {
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSuccess(false));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Please Complete Form',
        'Please fill in all required fields correctly before submitting.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API submission with progress
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const submissions = await AsyncStorage.getItem('supportSubmissions');
      const parsedSubmissions = submissions ? JSON.parse(submissions) : [];
      
      const ticketNumber = `SUP-${Date.now().toString().slice(-6)}`;
      const newSubmission = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        ticketNumber: ticketNumber
      };
      
      parsedSubmissions.push(newSubmission);
      await AsyncStorage.setItem('supportSubmissions', JSON.stringify(parsedSubmissions));

      showSuccessAnimation();
      
      setTimeout(() => {
        Alert.alert(
          '🎉 Request Submitted Successfully!',
          `Your support request has been received.\n\nTicket Number: ${ticketNumber}\n\nOur team will respond within 24 hours. You can track your request status in the tickets section.`,
          [
            {
              text: 'View My Tickets',
              onPress: () => {
                if (navigation && navigation.navigate) {
                  navigation.navigate('Tickets');
                }
              },
              style: 'default'
            },
            {
              text: 'Submit Another Request',
              onPress: () => {
                resetForm();
              },
              style: 'cancel'
            }
          ]
        );
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        '❌ Submission Failed',
        'We couldn\'t submit your request at this time. Please check your internet connection and try again.',
        [{ text: 'Try Again', style: 'default' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      schemeName: '',
      description: '',
      priority: 'medium',
      category: 'general'
    });
    setErrors({});
    setFormProgress(0);
    setFocusedInput(null);
    
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    // Back handler for Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleGoBack();
      return true; // Prevent default behavior
    });

    return () => backHandler.remove();
  }, [formProgress]);

  const Header = () => (
    <Animated.View style={[
      styles.header,
      { transform: [{ translateY: headerAnim }] }
    ]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleGoBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonIcon}>←</Text>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Support Request</Text>
        <Text style={styles.headerSubtitle}>Get help from our experts</Text>
      </View>
      
      <View style={styles.headerRight}>
        {formProgress > 0 && (
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetForm}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const CategorySelector = () => {
    const categories = [
      { id: 'general', label: 'General', icon: '💬' },
      { id: 'technical', label: 'Technical', icon: '⚙️' },
      { id: 'billing', label: 'Billing', icon: '💳' },
      { id: 'account', label: 'Account', icon: '👤' }
    ];

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category *</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                formData.category === category.id && styles.categoryButtonActive
              ]}
              onPress={() => handleInputChange('category', category.id)}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                formData.category === category.id && styles.categoryTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const PrioritySelector = () => {
    const priorities = [
      { id: 'low', label: 'Low', color: '#10b981' },
      { id: 'medium', label: 'Medium', color: '#f59e0b' },
      { id: 'high', label: 'High', color: '#ef4444' }
    ];

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Priority Level *</Text>
        <View style={styles.priorityContainer}>
          {priorities.map((priority) => (
            <TouchableOpacity
              key={priority.id}
              style={[
                styles.priorityButton,
                formData.priority === priority.id && {
                  ...styles.priorityButtonActive,
                  backgroundColor: priority.color,
                  borderColor: priority.color
                }
              ]}
              onPress={() => handleInputChange('priority', priority.id)}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <View style={[
                styles.priorityDot,
                { backgroundColor: priority.color }
              ]} />
              <Text style={[
                styles.priorityText,
                formData.priority === priority.id && styles.priorityTextActive
              ]}>
                {priority.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const EnhancedInput = ({ 
    field, 
    label, 
    placeholder, 
    multiline = false, 
    keyboardType = 'default', 
    icon,
    inputRef 
  }) => (
    <Animated.View style={[
      styles.inputGroup,
      errors[field] && { transform: [{ translateX: shakeAnim }] }
    ]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {icon} {label}
        </Text>
        {errors[field] && (
          <Animated.Text style={styles.errorText}>{errors[field]}</Animated.Text>
        )}
      </View>
      <View style={[
        styles.inputContainer,
        focusedInput === field && styles.inputContainerFocused,
        errors[field] && styles.inputContainerError
      ]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            multiline && styles.textArea
          ]}
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          value={formData[field] || ''}
          onChangeText={(text) => handleInputChange(field, text)}
          onFocus={() => setFocusedInput(field)}
          onBlur={() => {
            setFocusedInput(null);
            validateField(field, formData[field]);
          }}
          editable={!isSubmitting}
          multiline={multiline}
          numberOfLines={multiline ? 5 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          autoCorrect={keyboardType !== 'email-address'}
          autoCompleteType={field === 'email' ? 'email' : 'off'}
          returnKeyType={multiline ? 'default' : 'next'}
          blurOnSubmit={multiline}
          onSubmitEditing={() => {
            if (!multiline) {
              // Focus next input
              if (field === 'name' && emailInputRef.current) {
                emailInputRef.current.focus();
              } else if (field === 'email' && schemeInputRef.current) {
                schemeInputRef.current.focus();
              } else if (field === 'schemeName' && descriptionInputRef.current) {
                descriptionInputRef.current.focus();
              }
            }
          }}
        />
        {formData[field] && formData[field].length > 0 && !errors[field] && (
          <View style={styles.validIcon}>
            <Text style={styles.validIconText}>✓</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const ProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Form Progress</Text>
        <Text style={styles.progressPercentage}>{Math.round(formProgress)}%</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[
          styles.progressBar,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp'
            })
          }
        ]} />
      </View>
    </View>
  );

  const SuccessOverlay = () => (
    showSuccess && (
      <Animated.View style={[
        styles.successOverlay,
        {
          opacity: successAnim,
          transform: [{
            scale: successAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            })
          }]
        }
      ]}>
        <View style={styles.successContent}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successText}>Request Submitted!</Text>
          <Text style={styles.successSubtext}>We'll get back to you soon</Text>
        </View>
      </Animated.View>
    )
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <Header />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {/* Progress Bar */}
            <ProgressBar />

            {/* Form Container */}
            <View style={styles.formContainer}>
              <EnhancedInput
                field="name"
                label="Full Name *"
                placeholder="Enter your full name"
                icon="👤"
                inputRef={nameInputRef}
              />

              <EnhancedInput
                field="email"
                label="Email Address *"
                placeholder="your.email@example.com"
                keyboardType="email-address"
                icon="📧"
                inputRef={emailInputRef}
              />

              <CategorySelector />

              <EnhancedInput
                field="schemeName"
                label="Scheme/Program Name *"
                placeholder="Enter the scheme or program name"
                icon="📋"
                inputRef={schemeInputRef}
              />

              <PrioritySelector />

              <EnhancedInput
                field="description"
                label="Detailed Description *"
                placeholder="Please describe your issue in detail. Include any error messages, steps you've taken, and what you expected to happen..."
                multiline={true}
                icon="📝"
                inputRef={descriptionInputRef}
              />

              {/* Info Cards */}
              <View style={styles.infoCardsContainer}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoIcon}>⚡</Text>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Fast Response</Text>
                    <Text style={styles.infoText}>Response within 2-4 hours</Text>
                  </View>
                </View>
                
                <View style={styles.infoCard}>
                  <Text style={styles.infoIcon}>🔒</Text>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Secure & Private</Text>
                    <Text style={styles.infoText}>Your data is protected</Text>
                  </View>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                  formProgress === 100 && styles.submitButtonReady
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || formProgress < 100}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  {isSubmitting ? (
                    <>
                      <ActivityIndicator color="#ffffff" size="small" />
                      <Text style={[styles.submitButtonText, { marginLeft: 12 }]}>
                        Submitting...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>
                        {formProgress < 100 ? `Complete Form (${Math.round(formProgress)}%)` : 'Submit Support Request'}
                      </Text>
                      {formProgress === 100 && <Text style={styles.buttonIcon}>🚀</Text>}
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Emergency Contact */}
              <View style={styles.emergencyContact}>
                <Text style={styles.emergencyTitle}>🆘 Need Immediate Help?</Text>
                <Text style={styles.emergencyText}>
                  Call: <Text style={styles.emergencyPhone}>+1 (555) 911-HELP</Text>
                </Text>
                <Text style={styles.emergencySubtext}>Available 24/7 for critical issues</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <SuccessOverlay />
      <BottomTab screen="SUPPORT" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#334155',
    borderRadius: 12,
    minWidth: 80,
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#e2e8f0',
    marginRight: 6,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  headerRight: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#475569',
    borderRadius: 10,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  formContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 16,
    backgroundColor: '#0f172a',
    overflow: 'hidden',
    position: 'relative',
  },
  inputContainerFocused: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e293b',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  inputContainerError: {
    borderColor: '#ef4444',
    backgroundColor: '#1e293b',
  },
  textInput: {
    padding: 18,
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '500',
    minHeight: 56,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 18,
  },
  validIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    backgroundColor: '#10b981',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryScrollContent: {
    paddingRight: 20,
  },
  categoryButton: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    minWidth: 90,
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: '#0f172a',
    marginHorizontal: 4,
  },
  priorityButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f6',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  priorityTextActive: {
    color: '#ffffff',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#64748b',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonReady: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  emergencyContact: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
    textAlign: 'center',
  },
  emergencyPhone: {
    color: '#ef4444',
    fontWeight: '700',
  },
  emergencySubtext: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successContent: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10b981',
    textAlign: 'center',
  },
});

export default SupportPage;