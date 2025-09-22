import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import BottomTab from '../../components/BottomTab/BottomTab';
import GoldPlan from '../../ui/ProductCard/GoldPlans';
import GoldPlansSkeleton from '../../components/SkeletonLoader/GoldPlansSkeleton';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import appTheme from '../../utils/Theme';
import { LinearGradient } from 'expo-linear-gradient';

const { COLORS, SIZES, FONTS } = appTheme;

function GoldPlanScreen({ navigation }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://akj.brightechsoftware.com/v1/api/member/scheme');
        const data = await response.json();
        const formattedSchemes = data.map(s => ({
          schemeId: s.SchemeId,
          schemeName: s.schemeName,
          description: s.SchemeSName,
        }));
        setSchemes(formattedSchemes);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // Custom Header Component
  const CustomHeader = () => (
    <LinearGradient
      colors={COLORS.gradientPrimary}
      style={styles.headerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.title} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Gold Plans</Text>
          {/* <Text style={styles.headerSubtitle}>Choose your investment scheme</Text> */}
        </View>

        <View style={styles.headerRight} />
      </View>
    </LinearGradient>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <GoldPlansSkeleton />
          <GoldPlansSkeleton />
        </>
      );
    }

    if (!schemes || schemes.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="inventory" size={48} color={COLORS.textLight} />
          <Text style={styles.noDataText}>No Gold Plans available</Text>
          <Text style={styles.noDataSubtext}>
            Check back later for new investment opportunities
          </Text>
        </View>
      );
    }

    return schemes.map((scheme, index) => (
      <GoldPlan
        key={index}
        schemeId={scheme.schemeId}
        schemeName={scheme.schemeName}
        description={scheme.description}
        styles={styles.itemCardContainer}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/bg.jpg')}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Custom Header */}
          <CustomHeader />

          {/* Content */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.contentContainer}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Your Investment Portfolio</Text>
                <Text style={styles.welcomeSubtitle}>
                  Explore our premium gold investment schemes tailored for your financial growth
                </Text>
              </View>

              {renderContent()}
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <BottomTab screen="GOLDPLANS" />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
  },
  // Header Styles
  headerGradient: {
    paddingTop: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
    borderBottomLeftRadius: SIZES.radius_lg,
    borderBottomRightRadius: SIZES.radius_lg,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SIZES.margin,
  },
  headerTitle: {
    ...FONTS.h4,
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: 2,
  },
  headerSubtitle: {
    ...FONTS.fontXs,
    color: COLORS.text,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  // Content Styles
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.padding * 2,
  },
  contentContainer: {
    paddingHorizontal: SIZES.padding,
  },
  welcomeSection: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  welcomeTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: SIZES.margin / 2,
  },
  welcomeSubtitle: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  itemCardContainer: {
    marginBottom: SIZES.margin,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 3,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    margin: SIZES.margin,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  noDataText: {
    ...FONTS.h6,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SIZES.margin,
    marginBottom: SIZES.margin / 2,
  },
  noDataSubtext: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: SIZES.padding,
  },
});

export default GoldPlanScreen;