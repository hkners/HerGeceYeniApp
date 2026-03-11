import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated as RNAnimated,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

// ----------------------------------------------------------------------
// CONFIGURATION & THEME ("Clean Girl" Aesthetic)
// ----------------------------------------------------------------------

const THEME = {
  colors: {
    background: '#FAFAFB',       // Off-white/Alabaster
    white: '#FFFFFF',            // Pure White
    textPrimary: '#2D2D2D',      // Dark slate gray / Graphite
    textSecondary: '#757575',    // Slate Grey
    accentPeach: '#FFDAB9',      // Soft peach
    accentPink: '#FFC0CB',       // Blush pink
    accentSage: '#D4E2D4',       // Muted Sage
    accentLavender: '#E2D4F0',   // Hazy Lavender
    accentGold: '#F0E5D4',       // Pale Sunset Gold
    borderSoft: 'rgba(0, 0, 0, 0.04)',
    shadowSoft: 'rgba(0, 0, 0, 0.03)',
  },
  typography: {
    fontFamilyPrimary: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontFamilySecondary: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  radii: {
    squircle: 24,
    pill: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.03,
      shadowRadius: 40,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.05,
      shadowRadius: 30,
      elevation: 3,
    },
  },
};

const { width, height } = Dimensions.get('window');

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

// 1. Soft Squircle Button
const SquircleButton = ({ title, icon, onPress, isActive }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 20, stiffness: 90 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 90 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: isActive ? THEME.colors.accentPeach : THEME.colors.white,
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      style={styles.squircleWrapper}
    >
      <Animated.View style={[styles.squircleContainer, THEME.shadows.medium, animatedStyle]}>
        <Text style={[styles.squircleIcon, { color: isActive ? THEME.colors.textPrimary : THEME.colors.textSecondary }]}>
          {icon}
        </Text>
        <Text style={[styles.squircleTitle, { color: isActive ? THEME.colors.textPrimary : THEME.colors.textSecondary }]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// 2. The Pulsating Orb (Energy Pulse)
const EnergyPulse = ({ onLongPress, state }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  // Colors based on state
  const colors = {
    resting: THEME.colors.accentSage,
    flow: THEME.colors.accentLavender,
    drained: THEME.colors.accentPink,
    high: THEME.colors.accentGold,
  };

  useEffect(() => {
    // Start pulsing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      backgroundColor: withTiming(colors[state] || THEME.colors.accentPeach, { duration: 500 }),
    };
  });

  return (
    <View style={styles.pulseWrapper}>
      <Animated.View style={[styles.pulseOuter, THEME.shadows.soft, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={onLongPress}
          delayLongPress={500}
          style={styles.pulseInnerTouchable}
          accessibilityRole="button"
          accessibilityLabel="Energy Pulse, long press to log state"
        >
          <View style={[styles.pulseInner, { backgroundColor: colors[state] }]} />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.pulseLabel}>Hold to capture energy</Text>
    </View>
  );
};

// 3. Focus Ring
const FocusRing = ({ progress, task }) => {
  // Mock ring with border
  return (
    <View style={styles.focusRingContainer}>
      <View style={[styles.focusRingOuter, THEME.shadows.medium]}>
        <View style={styles.focusRingInner}>
          <Text style={styles.focusRingTask}>{task}</Text>
          <Text style={styles.focusRingTime}>24:59</Text>
        </View>
      </View>
    </View>
  );
};

// ----------------------------------------------------------------------
// MAIN APP COMPONENT
// ----------------------------------------------------------------------

export default function App() {
  const [activeTab, setActiveTab] = useState('focus'); // focus, rest, reflect
  const [energyState, setEnergyState] = useState('resting');
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(false);

  // Handle Long Press on Orb
  const handleOrbPress = () => {
    const states = ['resting', 'flow', 'drained', 'high'];
    const nextIndex = (states.indexOf(energyState) + 1) % states.length;
    setEnergyState(states[nextIndex]);
  };

  // Views
  const renderDashboard = () => (
    <View style={styles.viewContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTime}>Just past noon</Text>
        <Text style={styles.headerState}>Current: {energyState.charAt(0).toUpperCase() + energyState.slice(1)}</Text>
      </View>

      <View style={styles.mainContent}>
        <EnergyPulse state={energyState} onLongPress={handleOrbPress} />
      </View>
    </View>
  );

  const renderFocusSession = () => (
    <View style={[styles.viewContainer, { backgroundColor: THEME.colors.accentSage + '33' }]}>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Deep Work</Text>
      </View>

      <View style={styles.mainContent}>
        <FocusRing task="Write Architecture Doc" progress={0.3} />
      </View>
    </View>
  );

  const renderReflect = () => (
    <View style={styles.viewContainer}>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Insights</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={[styles.insightCard, THEME.shadows.soft]}>
          <Text style={styles.insightTitle}>Peak Flow</Text>
          <Text style={styles.insightBody}>You achieved 2 hours of deep focus this morning.</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Dynamic View Content */}
        {activeTab === 'focus' && renderFocusSession()}
        {activeTab === 'rest' && renderDashboard()}
        {activeTab === 'reflect' && renderReflect()}

        {/* Floating Bottom Navigation */}
        <View style={styles.navBarWrapper}>
          <View style={[styles.navBar, THEME.shadows.medium]}>
            <SquircleButton
              title="Focus"
              icon="✧"
              isActive={activeTab === 'focus'}
              onPress={() => setActiveTab('focus')}
            />
            <SquircleButton
              title="Rest"
              icon="○"
              isActive={activeTab === 'rest'}
              onPress={() => setActiveTab('rest')}
            />
            <SquircleButton
              title="Reflect"
              icon="≈"
              isActive={activeTab === 'reflect'}
              onPress={() => setActiveTab('reflect')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  viewContainer: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  headerTime: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    fontFamily: THEME.typography.fontFamilyPrimary,
    letterSpacing: 0.5,
  },
  headerState: {
    fontSize: 14,
    color: THEME.colors.textPrimary,
    marginTop: 8,
    fontWeight: '500',
  },
  headerCenter: {
    marginTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Orb
  pulseWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseInnerTouchable: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.8,
  },
  pulseLabel: {
    marginTop: 40,
    fontSize: 14,
    color: THEME.colors.textSecondary,
    letterSpacing: 0.5,
  },

  // Focus Ring
  focusRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusRingOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: THEME.colors.accentPeach,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.white,
  },
  focusRingInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusRingTask: {
    fontSize: 20,
    color: THEME.colors.textPrimary,
    fontWeight: '500',
    marginBottom: 8,
  },
  focusRingTime: {
    fontSize: 48,
    fontWeight: '300',
    color: THEME.colors.textPrimary,
    letterSpacing: -1,
  },

  // Insight Card
  insightCard: {
    backgroundColor: THEME.colors.white,
    padding: 32,
    borderRadius: THEME.radii.squircle,
    width: '100%',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginBottom: 12,
  },
  insightBody: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Navigation
  navBarWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radii.pill,
    padding: 8,
    gap: 12,
  },
  squircleWrapper: {
    // Wrapper for touchable
  },
  squircleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: THEME.radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  squircleIcon: {
    fontSize: 16,
  },
  squircleTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});
