import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Dimensions, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
  interpolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Data
const MOCK_ENTRIES = [
  { id: '1', thought: 'Felt a sudden clarity after the morning walk.', tint: 'peach', time: 'Just past nine' },
  { id: '2', thought: 'The coffee is exceptionally good today.', tint: 'pink', time: 'Mid morning' },
  { id: '3', thought: 'Focusing on one task at a time.', tint: 'peach', time: 'Early afternoon' },
];

// Configuration for spring animations
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 90,
};

// "Pulse" Orb Component
const PulseOrb = ({ onPress, isRecording }) => {
  const scale = useSharedValue(1);
  const breathScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      breathScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      breathScale.value = withTiming(1, { duration: 500 });
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value * breathScale.value }
      ]
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: isRecording ? withTiming(0.8, { duration: 500 }) : withTiming(0.3, { duration: 500 }),
      transform: [{ scale: isRecording ? withTiming(1.3, { duration: 500 }) : withTiming(1, { duration: 500 }) }]
    };
  });

  return (
    <View style={styles.pulseContainer}>
      <Animated.View style={[styles.pulseGlow, glowStyle]} />
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.9, SPRING_CONFIG); onPress(true); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG); onPress(false); }}
        accessibilityRole="button"
        accessibilityLabel="Record a thought"
        accessibilityState={{ expanded: isRecording }}
      >
        <Animated.View style={[styles.pulseCore, animatedStyle]}>
          <Text style={styles.pulseText}>{isRecording ? 'Breathe...' : 'Pulse'}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

// "Light Card" Entry Component
const LightCard = ({ item }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  // Soft tint based on category
  const getTintColor = () => {
    return item.tint === 'peach' ? '#FFDAB9' : '#FFC0CB';
  };

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.95, SPRING_CONFIG); }}
      onPressOut={() => { scale.value = withSpring(1, SPRING_CONFIG); }}
      accessibilityRole="button"
      accessibilityLabel={`Journal entry: ${item.thought}`}
    >
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        {/* Soft highlight representation using an absolute view */}
        <View style={[styles.cardGlow, { backgroundColor: getTintColor() }]} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTime}>{item.time}</Text>
          <Text style={styles.cardThought}>{item.thought}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};


export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState(MOCK_ENTRIES);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Lume</Text>
          <Text style={styles.subtitle}>The Kinetic Journal for Cognitive Clarity</Text>
        </View>

        <View style={styles.orbSection}>
          <PulseOrb onPress={setIsRecording} isRecording={isRecording} />
        </View>

        <View style={styles.feedSection}>
          <Text style={styles.sectionTitle}>Recent Thoughts</Text>
          {entries.map((entry) => (
            <LightCard key={entry.id} item={entry} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Off-White base layer
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 60,
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2D2D2D', // Dark slate gray
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#71717A', // Muted zinc
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  orbSection: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  pulseContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFF4E5', // Champagne Glow
    opacity: 0.3,
    // "Airy Shadow" equivalent without Skia: high blur radius, low opacity, centered
    shadowColor: '#FFF4E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 4,
  },
  pulseCore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF', // Pure white core
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)', // hairline stroke
    shadowColor: '#E0E7FF', // Periwinkle Mist shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  pulseText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#2D2D2D',
    letterSpacing: 1,
  },
  feedSection: {
    width: '100%',
    alignItems: 'stretch',
    gap: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500', // Medium weight
    color: '#71717A',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF', // Clean white cards
    borderRadius: 24, // Soft rounded corners
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)', // Hairline border
    shadowColor: '#2D2D2D', // "Airy shadow" base
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04, // Very low opacity
    shadowRadius: 30, // High blur radius
    elevation: 2,
    marginBottom: 20, // Add explicit margin bottom instead of flex gap since react native older versions might not support flex gap on simple views perfectly
  },
  cardGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15, // Subtle soft tint blur
  },
  cardContent: {
    padding: 24,
    paddingTop: 30, // Make room for the glow visually
  },
  cardTime: {
    fontSize: 12,
    fontWeight: '300',
    color: '#A0A0A0', // Lighter muted text
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cardThought: {
    fontSize: 16,
    fontWeight: '300', // Light for airy feel
    color: '#2D2D2D',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
});
