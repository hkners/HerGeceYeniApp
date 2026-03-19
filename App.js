import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback, memo } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';

const INITIAL_ENTRIES = [
  { id: '1', mood: 'calm', anchor: 'stillness', colorStart: '#F3E8FF', colorEnd: '#E0E7FF' }, // Pale Lavender to Soft Periwinkle
  { id: '2', mood: 'fresh', anchor: 'clarity', colorStart: '#DCFCE7', colorEnd: '#FFFFFF' }, // Mint Mist to Pure White
  { id: '3', mood: 'warm', anchor: 'radiance', colorStart: '#FFDAB9', colorEnd: '#FFC0CB' }, // Soft Peach to Blush Pink
  { id: '4', mood: 'quiet', anchor: 'breeze', colorStart: '#F3E8FF', colorEnd: '#FAFAFA' },
  { id: '5', mood: 'focus', anchor: 'flow', colorStart: '#E0E7FF', colorEnd: '#DCFCE7' },
];

const BreathOrb = ({ isBreathing, onBreathComplete }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    if (isBreathing) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // infinite
        true // reverse
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.7, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 1000 });
      opacity.value = withTiming(0.7, { duration: 1000 });
    }
  }, [isBreathing, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.orbContainer}>
      <Animated.View style={[styles.orbGlow, animatedStyle]} pointerEvents="none" />
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => onBreathComplete(true)}
        onPressOut={() => onBreathComplete(false)}
        style={styles.orbCore}
        accessibilityRole="button"
        accessibilityLabel="Breath Orb"
        accessibilityHint="Tap and hold to start breathing exercise"
      >
        <Text style={styles.orbText}>{isBreathing ? 'exhale...' : 'inhale...'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const LightCard = memo(({ entry }) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: 150, easing: Easing.out(Easing.ease) });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { backgroundColor: entry.colorStart }]}
        accessibilityRole="button"
        accessibilityLabel={`Journal entry for ${entry.anchor}`}
      >
        {/* Simulating a soft gradient aura with nested views and opacity */}
        <View style={[styles.cardAura, { backgroundColor: entry.colorEnd, opacity: 0.6 }]} />
        <View style={styles.cardContent}>
           <Text style={styles.cardAnchor}>{entry.anchor}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function App() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [isBreathing, setIsBreathing] = useState(false);

  const handleBreathToggle = useCallback((state) => {
    setIsBreathing(state);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Lume</Text>
          <Text style={styles.subtitle}>Capture the light between the moments.</Text>
        </View>

        <BreathOrb isBreathing={isBreathing} onBreathComplete={handleBreathToggle} />

        <View style={styles.feedHeader}>
           <Text style={styles.feedTitle}>Recent Auras</Text>
        </View>

        <View style={styles.listContainer}>
          {entries.map(entry => (
            <LightCard key={entry.id} entry={entry} />
          ))}
        </View>

      </ScrollView>

      {/* Floating Add Button Placeholder */}
      <View style={styles.fabContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Add new entry"
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Soft White Base
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 100, // Extra padding for FAB
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2D2D2D',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#71717A',
    letterSpacing: 0.5,
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 40,
  },
  orbGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFDAB9', // Soft Peach glow
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 10,
  },
  orbCore: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF', // Pure White core
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  orbText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    letterSpacing: 1,
  },
  feedHeader: {
    marginBottom: 20,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2D2D2D',
    letterSpacing: -0.2,
  },
  listContainer: {
    gap: 24,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    width: '100%',
    height: 140,
    borderRadius: 32,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // Soft Highlights / Dropshadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 4,
  },
  cardAura: {
    ...StyleSheet.absoluteFillObject,
    // Simulate a blur/gradient by overlaying a semi-transparent color
    borderTopLeftRadius: 100,
    borderBottomRightRadius: 100,
    transform: [{ scale: 1.5 }],
  },
  cardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Frosted glass effect
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  cardAnchor: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D2D2D',
    letterSpacing: -0.5,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  fabText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2D2D2D',
    marginTop: -4, // Optical alignment
  }
});