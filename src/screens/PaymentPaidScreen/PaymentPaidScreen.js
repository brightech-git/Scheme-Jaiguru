import React, { useContext, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { BlurView } from "expo-blur"; // Uncomment if supported in your environment
import BottomTab from "../../components/BottomTab/BottomTab";
import { SchemeContext } from "../../services/SchemeContext/SchemeContext";
import SchemeCard from "../../ui/SchemeCard/SchemeCard";

const { width } = Dimensions.get("window");

const AllSchemesScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    productData = [],
    loading,
    error,
    refetch,
    getActiveSchemes,
    getInactiveSchemes,
    getTotalAmount,
  } = useContext(SchemeContext);
  console.log("Product Data:", productData);
  console.log("Loading:", loading);
  console.log("Error:", error);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    if (error) {
      Alert.alert("Error", error, [{ text: "Retry", onPress: () => refetch() }]);
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSchemePress = (scheme) => {
    if (scheme?.accountDetails) {
      navigation.navigate("PaymentHistory", {
        accountDetails: scheme.accountDetails,
        schemeName: scheme.schemeName?.trim() || "Scheme",
      });
    }
  };

  const getFilteredData = () => {
    switch (selectedFilter) {
      case "active":
        return getActiveSchemes();
      case "inactive":
        return getInactiveSchemes();
      default:
        return productData;
    }
  };

  const filteredData = getFilteredData();
  const activeCount = getActiveSchemes().length;
  const totalAmount = getTotalAmount();

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const FilterTab = ({ filter, label, count, icon }) => (
    <TouchableOpacity
      style={[styles.filterTab, selectedFilter === filter && styles.activeFilterTab]}
      onPress={() => setSelectedFilter(filter)}
      accessibilityRole="button"
      accessibilityLabel={`${label} filter with ${count} schemes`}
    >
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={selectedFilter === filter ? "#fff" : "rgba(255,255,255,0.7)"}
      />
      <Text
        style={[styles.filterTabText, selectedFilter === filter && styles.activeFilterTabText]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.filterCountBadge,
          selectedFilter === filter && styles.activeFilterCountBadge,
        ]}
      >
        <Text
          style={[
            styles.filterCountText,
            selectedFilter === filter && styles.activeFilterCountText,
          ]}
        >
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const LoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <LinearGradient
            colors={["#e0e0e0", "#f0f0f0", "#e0e0e0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.skeletonGradient}
          >
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonBadge} />
            </View>
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonProgress} />
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLineShort} />
            </View>
          </LinearGradient>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require("../../assets/otpbg.jpg")}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={["rgba(30, 58, 138, 0.95)", "rgba(79, 70, 229, 0.85)", "rgba(99, 102, 241, 0.7)"]}
          style={styles.gradientOverlay}
        >
          <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
            {/* <BlurView intensity={80} style={styles.blurContainer}> */}
              <SafeAreaView>
                <View style={styles.blurHeaderContent}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.blurBackButton}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                  >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.blurHeaderTitle}>Your Schemes</Text>
                  <TouchableOpacity
                    style={styles.blurRefreshButton}
                    onPress={handleRefresh}
                    accessibilityRole="button"
                    accessibilityLabel="Refresh schemes"
                  >
                    <MaterialIcons
                      name="refresh"
                      size={24}
                      color="#fff"
                      style={refreshing ? styles.refreshingIcon : null}
                    />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            {/* </BlurView> */}
          </Animated.View>

          <SafeAreaView style={styles.safeArea}>
            <Animated.View
              style={[styles.headerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>

              <View style={styles.headerContent}>
                <Text style={styles.welcomeText}>Your Portfolio</Text>
                <Text style={styles.headerTitle}>Investment Schemes</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="folder-multiple" size={22} color="#fff" />
                    <Text style={styles.statNumber}>{productData.length}</Text>
                    <Text style={styles.statLabel}>Total Schemes</Text>
                  </View>
                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="check-circle" size={22} color="#34c759" />
                    <Text style={styles.statNumber}>{activeCount}</Text>
                    <Text style={styles.statLabel}>Active Schemes</Text>
                  </View>
                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="currency-inr" size={22} color="#ffd700" />
                    <Text style={styles.statNumber}>₹{(totalAmount / 1000).toFixed(1)}K</Text>
                    <Text style={styles.statLabel}>Total Value</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            <View style={styles.filterContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <FilterTab
                  filter="all"
                  label="All Schemes"
                  count={productData.length}
                  icon="view-grid"
                />
                <FilterTab
                  filter="active"
                  label="Active"
                  count={activeCount}
                  icon="check-circle"
                />
                <FilterTab
                  filter="inactive"
                  label="Inactive"
                  count={productData.length - activeCount}
                  icon="pause-circle"
                />
              </ScrollView>
            </View>

            <Animated.ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#fff"
                  title="Refreshing..."
                  titleColor="#fff"
                />
              }
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
            >
              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : filteredData.length > 0 ? (
                filteredData.map((scheme, index) => (
                  <SchemeCard
                    key={`${scheme.regno}-${scheme.groupcode}`}
                    scheme={scheme}
                    index={index}
                    onPress={() => handleSchemePress(scheme)}
                  />
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#fff" />
                  <Text style={styles.noDataText}>No schemes available</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleRefresh}
                    accessibilityRole="button"
                    accessibilityLabel="Retry loading schemes"
                  >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.ScrollView>

            <BottomTab screen="SCHEMES" />
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainBackground: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.1,
    resizeMode: "cover",
  },
  gradientOverlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(30, 58, 138, 0.8)", // Fallback for when BlurView is disabled
  },
  blurContainer: {
    paddingTop: StatusBar.currentHeight || 30,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  blurHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  blurBackButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  blurRefreshButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  blurHeaderTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "System", // Replace with custom font if available
  },
  refreshingIcon: {
    transform: [{ rotate: "360deg" }],
    transition: "transform 0.5s",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 30,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 12,
  },
  headerContent: {
    marginBottom: 16,
  },
  welcomeText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "System",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "System",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterScrollContent: {
    paddingHorizontal: 4,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: "#4f46e5",
  },
  filterTabText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  activeFilterTabText: {
    color: "#fff",
  },
  filterCountBadge: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  activeFilterCountBadge: {
    backgroundColor: "#1e3a8a",
  },
  filterCountText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
  },
  activeFilterCountText: {
    color: "#fff",
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  noDataText: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 40,
  },
  skeletonContainer: {
    marginTop: 16,
  },
  skeletonCard: {
    height: 180,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonGradient: {
    flex: 1,
    padding: 16,
  },
  skeletonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  skeletonTitle: {
    width: 120,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
  skeletonBadge: {
    width: 60,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonProgress: {
    width: "80%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonLine: {
    width: "90%",
    height: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: "60%",
    height: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
});

export default AllSchemesScreen;