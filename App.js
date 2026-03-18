import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, Pressable, ScrollView, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolation,
  runOnJS,
  useAnimatedProps
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Mock Data
const VAPOR_TASKS = [
  { id: '1', title: 'Morning hydration', size: 100, priority: 1, basePosition: { x: width * 0.1, y: height * 0.1 } },
  { id: '2', title: 'Review key goals', size: 130, priority: 2, basePosition: { x: width * 0.5, y: height * 0.25 } },
  { id: '3', title: 'Deep focus block', size: 160, priority: 3, basePosition: { x: width * 0.15, y: height * 0.45 } },
];

const AMBIENCES = [
  { id: 'a1', title: 'Morning in Kyoto', type: 'calm' },
  { id: 'a2', title: 'Library Rainstorm', type: 'focus' },
];

// --- Components ---

// 1. Mesh Gradient Background (Simplified with Reanimated for Expo/Web compatibility without skia)
const MeshBackground = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: 1.5 }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotation.value}deg` }, { scale: 1.8 }],
  }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#FAFAFA' }]} />
      <Animated.View style={[styles.meshBlob, styles.meshBlob1, animatedStyle1]} />
      <Animated.View style={[styles.meshBlob, styles.meshBlob2, animatedStyle2]} />
      {/* Blur overlay to soften the blobs */}
      <View style={[StyleSheet.absoluteFillObject, styles.glassOverlay]} />
    </View>
  );
};

// 2. Aura Button (Primary CTA)
const AuraButton = ({ title, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(0.8, { duration: 150 });
    if (onPress) onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.auraButtonContainer, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.auraButton}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Text style={styles.auraButtonText}>{title}</Text>
      </Pressable>
      {/* Soft glowing halo */}
      <View style={styles.auraButtonHalo} pointerEvents="none" />
    </Animated.View>
  );
};

// 3. Vapor Task Bubble
const VaporTask = ({ task, onDissipate }) => {
  const isVisible = useSharedValue(1);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const wobbleX = useSharedValue(0);
  const wobbleY = useSharedValue(0);

  // Initial wobble effect
  useEffect(() => {
    const randomOffset = Math.random() * 1000;
    wobbleX.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 2000 + randomOffset, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 2000 + randomOffset, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    wobbleY.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 2300 + randomOffset, easing: Easing.inOut(Easing.ease) }),
        withTiming(-8, { duration: 2300 + randomOffset, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [wobbleX, wobbleY]);

  const handlePress = () => {
    // Dissipate animation: float up, scale up slightly, fade out
    translateY.value = withTiming(-200, { duration: 600, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1.2, { duration: 600 });
    isVisible.value = withTiming(0, { duration: 600 }, (finished) => {
      if (finished) {
        runOnJS(onDissipate)(task.id);
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isVisible.value,
    transform: [
      { translateX: wobbleX.value },
      { translateY: translateY.value + wobbleY.value },
      { scale: scale.value }
    ],
  }));

  // Style based on priority to give varied translucent look
  const bubbleStyles = [
    styles.vaporBubble,
    { width: task.size, height: task.size, borderRadius: task.size / 2 },
    task.priority === 3 ? styles.vaporHigh :
    task.priority === 2 ? styles.vaporMedium :
    styles.vaporLow
  ];

  return (
    <Animated.View style={[animatedStyle, { position: 'absolute', top: task.basePosition.y, left: task.basePosition.x }]}>
      <Pressable onPress={handlePress} style={bubbleStyles} accessibilityRole="button" accessibilityLabel={`Complete ${task.title}`}>
        <View style={styles.vaporGlass}>
          <Text style={styles.vaporText} numberOfLines={2} adjustsFontSizeToFit>{task.title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// 4. Breathe-Sync Launchpad (Centering Screen)
const BreatheSync = ({ onComplete }) => {
  const progress = useSharedValue(0);
  const ringScale = useSharedValue(1);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    if (isHolding) {
      // Simulate 3-second breathing sync
      progress.value = withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }, (finished) => {
        if (finished) {
          runOnJS(onComplete)();
        }
      });
      ringScale.value = withTiming(1.5, { duration: 3000, easing: Easing.inOut(Easing.ease) });
    } else {
      progress.value = withTiming(0, { duration: 500 });
      ringScale.value = withTiming(1, { duration: 500 });
    }
  }, [isHolding, progress, ringScale, onComplete]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: interpolate(progress.value, [0, 0.8, 1], [0.3, 0.8, 0]),
  }));

  const textOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2], [1, 0]),
  }));

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.breatheContainer]}>
      <Animated.View style={[styles.breatheRing, ringStyle]} />
      <Pressable
        onPressIn={() => setIsHolding(true)}
        onPressOut={() => setIsHolding(false)}
        style={styles.breatheTarget}
        accessibilityRole="button"
        accessibilityLabel="Hold to center and sync breath"
      >
        <Animated.Text style={[styles.breatheText, textOpacity]}>
          Hold to Center
        </Animated.Text>
      </Pressable>
    </View>
  );
};

// --- Main App Component ---
export default function App() {
  const [stage, setStage] = useState('splash'); // 'splash', 'centering', 'dashboard'
  const [tasks, setTasks] = useState(VAPOR_TASKS);
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    // Initial Splash timeout
    if (stage === 'splash') {
      const timer = setTimeout(() => {
        splashOpacity.value = withTiming(0, { duration: 800 }, (finished) => {
          if (finished) runOnJS(setStage)('centering');
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [stage, splashOpacity]);

  const handleCenteringComplete = useCallback(() => {
    setStage('dashboard');
  }, []);

  const handleTaskDissipate = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    zIndex: stage === 'splash' ? 10 : -1,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <MeshBackground />

      {/* Header (Frosted Glass simulation) */}
      {(stage === 'centering' || stage === 'dashboard') && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AETHER</Text>
          <Text style={styles.headerSubtitle}>Curate your headspace</Text>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.content}>
        {stage === 'centering' && (
          <BreatheSync onComplete={handleCenteringComplete} />
        )}

        {stage === 'dashboard' && (
          <View style={StyleSheet.absoluteFillObject}>
             {tasks.length > 0 ? (
               tasks.map(task => (
                 <VaporTask key={task.id} task={task} onDissipate={handleTaskDissipate} />
               ))
             ) : (
               <View style={styles.emptyState}>
                 <Text style={styles.emptyStateText}>Your headspace is clear.</Text>
                 <View style={{ marginTop: 40 }}>
                   <AuraButton title="Enter the Chamber" onPress={() => {}} />
                 </View>
               </View>
             )}
          </View>
        )}
      </View>

      {/* Splash Screen Overlay */}
      <Animated.View style={[StyleSheet.absoluteFillObject, styles.splashContainer, splashStyle]} pointerEvents={stage === 'splash' ? 'auto' : 'none'}>
        <View style={styles.splashDot} />
      </Animated.View>

    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean Girl pure white base
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  // Mesh Background Styles
  meshBlob: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    opacity: 0.15,
  },
  meshBlob1: {
    top: -width * 0.5,
    left: -width * 0.5,
    backgroundColor: '#FFDAB9', // Soft peach
  },
  meshBlob2: {
    bottom: -width * 0.5,
    right: -width * 0.5,
    backgroundColor: '#FFC0CB', // Blush pink
  },
  glassOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    ...(Platform.OS === 'ios' ? { backdropFilter: 'blur(20px)' } : {}),
  },
  // Header
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 5,
  },
  headerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 28,
    color: '#334155', // Slate Grey
    letterSpacing: 2,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 14,
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  // Splash
  splashContainer: {
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFC0CB',
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  // Breathe-Sync
  breatheContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  breatheRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFDAB9',
    backgroundColor: 'rgba(255, 218, 185, 0.1)',
  },
  breatheTarget: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  breatheText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // Vapor Tasks
  vaporBubble: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#334155',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  vaporGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  vaporHigh: {
    backgroundColor: 'rgba(255, 192, 203, 0.15)', // Blush pink tint
  },
  vaporMedium: {
    backgroundColor: 'rgba(255, 218, 185, 0.15)', // Soft peach tint
  },
  vaporLow: {
    backgroundColor: 'rgba(240, 240, 240, 0.3)',
  },
  vaporText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Aura Button
  auraButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  auraButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24, // Soft rounded corners
    borderWidth: 1,
    borderColor: 'rgba(255, 218, 185, 0.5)',
    zIndex: 2,
  },
  auraButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  auraButtonHalo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFDAB9',
    borderRadius: 24,
    opacity: 0.3,
    transform: [{ scale: 1.1 }],
    filter: Platform.OS === 'web' ? 'blur(10px)' : undefined, // Simulated soft shadow
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 20,
    color: '#94A3B8',
    fontStyle: 'italic',
  }
});
