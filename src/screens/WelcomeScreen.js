import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Modal } from "react-native";

const { width } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }) {
  const [showPopup, setShowPopup] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const popupScale = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate popup entrance
    Animated.spring(popupScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Rotate animation for leaf
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (showIntro) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showIntro]);

  const handlePopupClose = () => {
    Animated.timing(popupScale, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPopup(false);
      setShowIntro(true);
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg']
  });

  return (
    <View style={styles.container}>
      {/* Beautiful Popup Modal */}
      <Modal
        transparent={true}
        visible={showPopup}
        animationType="none"
      >
        <View style={styles.popupOverlay}>
          <Animated.View style={[styles.popupCard, { transform: [{ scale: popupScale }] }]}>
            <View style={styles.popupIconContainer}>
              <Animated.Text style={[styles.popupIcon, { transform: [{ rotate: spin }] }]}>
                🌱
              </Animated.Text>
            </View>
            
            <Text style={styles.popupWelcome}>Welcome to</Text>
            <Text style={styles.popupAppName}>Energy Saver</Text>
            <Text style={styles.popupTagline}>Your Journey to Sustainability Starts Here!</Text>
            
            <View style={styles.popupFeatures}>
              <View style={styles.popupFeatureItem}>
                <Text style={styles.popupFeatureIcon}>💡</Text>
                <Text style={styles.popupFeatureText}>Track Usage</Text>
              </View>
              <View style={styles.popupFeatureItem}>
                <Text style={styles.popupFeatureIcon}>💰</Text>
                <Text style={styles.popupFeatureText}>Save Money</Text>
              </View>
              <View style={styles.popupFeatureItem}>
                <Text style={styles.popupFeatureIcon}>🌍</Text>
                <Text style={styles.popupFeatureText}>Help Planet</Text>
              </View>
            </View>
            
            <Pressable
              style={({ pressed }) => [
                styles.popupButton,
                pressed && styles.popupButtonPressed,
              ]}
              onPress={handlePopupClose}
            >
              <Text style={styles.popupButtonText}>Let's Start! 🚀</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>

      {/* Main Intro Screen (shows after popup) */}
      {showIntro && (
        <>
          {/* Animated Background Circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />
          <View style={styles.circle4} />

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Animated Leaf Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.leafIconOuter}>
                <View style={styles.leafIconMiddle}>
                  <View style={styles.leafIconInner}>
                    <Text style={styles.leafEmoji}>🌱</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.title}>Energy Saver</Text>
            <Text style={styles.subtitle}>Track & Reduce Your Footprint</Text>

            {/* Feature Cards */}
            <View style={styles.featuresContainer}>
              <View style={[styles.feature, styles.feature1]}>
                <View style={styles.featureIconBg}>
                  <Text style={styles.featureIcon}>💡</Text>
                </View>
                <Text style={styles.featureTitle}>Monitor</Text>
                <Text style={styles.featureText}>Track your energy usage in real-time</Text>
              </View>
              
              <View style={[styles.feature, styles.feature2]}>
                <View style={styles.featureIconBg}>
                  <Text style={styles.featureIcon}>🎯</Text>
                </View>
                <Text style={styles.featureTitle}>Goals</Text>
                <Text style={styles.featureText}>Set & achieve sustainability targets</Text>
              </View>
              
              <View style={[styles.feature, styles.feature3]}>
                <View style={styles.featureIconBg}>
                  <Text style={styles.featureIcon}>💰</Text>
                </View>
                <Text style={styles.featureTitle}>Save</Text>
                <Text style={styles.featureText}>Reduce bills & carbon footprint</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>30%</Text>
                <Text style={styles.statLabel}>Avg. Savings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>24/7</Text>
                <Text style={styles.statLabel}>Tracking</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>100%</Text>
                <Text style={styles.statLabel}>Free</Text>
              </View>
            </View>

            <Text style={styles.description}>
              Join Singapore's Green Plan 2030 and make a real impact.{"\n"}
              Every kWh saved brings us closer to a sustainable future! 🌏
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.replace("Home")}
            >
              <Text style={styles.buttonText}>Start Tracking Now</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </Pressable>

            <Text style={styles.footer}>🇸🇬 Supporting Singapore Green Plan 2030</Text>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a2f1f",
    position: "relative",
  },
  
  // ============ POPUP STYLES ============
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  popupCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 36,
    alignItems: "center",
    width: "88%",
    maxWidth: 360,
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  popupIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e8f8f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 4,
    borderColor: "#2ecc71",
  },
  popupIcon: {
    fontSize: 56,
  },
  popupWelcome: {
    fontSize: 18,
    color: "#7f8c8d",
    fontWeight: "600",
    marginBottom: 6,
  },
  popupAppName: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0d3b2a",
    marginBottom: 8,
    letterSpacing: -1,
  },
  popupTagline: {
    fontSize: 15,
    color: "#2ecc71",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  popupFeatures: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  popupFeatureItem: {
    alignItems: "center",
    flex: 1,
  },
  popupFeatureIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  popupFeatureText: {
    fontSize: 12,
    color: "#34495e",
    fontWeight: "700",
    textAlign: "center",
  },
  popupButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 28,
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  popupButtonPressed: {
    backgroundColor: "#27ae60",
    transform: [{ scale: 0.96 }],
  },
  popupButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  // ============ INTRO SCREEN STYLES ============
  circle1: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(46, 204, 113, 0.08)",
    top: -80,
    left: -60,
  },
  circle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(46, 204, 113, 0.12)",
    top: 120,
    right: -40,
  },
  circle3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(46, 204, 113, 0.06)",
    bottom: 100,
    left: width / 2 - 100,
  },
  circle4: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    bottom: 200,
    right: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 28,
  },
  leafIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(46, 204, 113, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  leafIconMiddle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(46, 204, 113, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#2ecc71",
  },
  leafIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
  },
  leafEmoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 46,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: -1.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#2ecc71",
    fontWeight: "700",
    marginBottom: 40,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  featuresContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  feature: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(46, 204, 113, 0.3)",
    backdropFilter: "blur(10px)",
  },
  feature1: {
    backgroundColor: "rgba(46, 204, 113, 0.12)",
  },
  feature2: {
    backgroundColor: "rgba(52, 152, 219, 0.12)",
  },
  feature3: {
    backgroundColor: "rgba(241, 196, 15, 0.12)",
  },
  featureIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 26,
  },
  featureTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  featureText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(46, 204, 113, 0.3)",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2ecc71",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "700",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 8,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonPressed: {
    backgroundColor: "#27ae60",
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  buttonArrow: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});