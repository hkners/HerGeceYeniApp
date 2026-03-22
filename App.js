import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  runOnJS,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// --- COLORS (Strictly adhered to) ---
const COLORS = {
  background: '#FAFAFA', // Alabaster/Ultra-light off-white
  surface: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  accentPeach: '#FFDAB9',
  accentPink: '#FFC0CB',
  // Colors mentioned in issue 55 (Aether) & 51 (Luva) mapped to allowed colors where possible
  // Using pure white/alabaster for the airy minimal feel
};

// --- MOCK DATA ---
const INITIAL_TASKS = [
  { id: '1', title: 'Deep Work: Project Proposal', priority: 'high', size: 120 },
  { id: '2', title: 'Review PRs', priority: 'medium', size: 90 },
  { id: '3', title: 'Reply to Emails', priority: 'low', size: 70 },
];

const ENVIRONMENTS = [
  { id: 'e1', title: 'Library in a Rainstorm' },
  { id: 'e2', title: 'Morning in Kyoto' },
  { id: 'e3', title: 'Deep Space' },
];

// --- COMPONENTS ---

// 1. The "Breathe-Sync" Launchpad
const CenteringScreen = ({ onComplete }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // 10-second centering animation (simplified for prototype)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      2, // Do it twice (10 seconds total)
      true,
      (finished) => {
        if (finished) {
           runOnJS(onComplete)();
        }
      }
    );
  }, [scale, onComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={[styles.centerContainer, { backgroundColor: COLORS.background }]}>
      <Text style={styles.heroText}>Sync your breath.</Text>
      <Animated.View style={[styles.breathingRing, animatedStyle]} />
      <Text style={styles.subText}>Hold to begin</Text>
    </View>
  );
};

// 2. The "Vapor" Task Bubble
const TaskBubble = ({ task, onDissipate }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const floatY = useSharedValue(0);

  // Gentle floating animation
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000 + Math.random() * 1000, easing: Easing.inOut(Easing.sine) }),
        withTiming(5, { duration: 2000 + Math.random() * 1000, easing: Easing.inOut(Easing.sine) })
      ),
      -1,
      true
    );

    // Cleanup loop on unmount to prevent memory leaks
    return () => {
        // Stop animations if component unmounts
        // Reanimated 3 automatically cancels, but explicit cancellation is good practice
    };
  }, [floatY]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleLongPress = () => {
    // "Swipe up to dissipate" interaction
    translateY.value = withTiming(-height, { duration: 800, easing: Easing.out(Easing.exp) }, (finished) => {
        if (finished) {
            runOnJS(onDissipate)(task.id);
        }
    });
    scale.value = withTiming(0, { duration: 800 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value + floatY.value },
        { scale: scale.value },
      ],
      opacity: interpolate(translateY.value, [0, -200], [1, 0], Extrapolation.CLAMP),
    };
  });

  // Calculate dynamic styling based on priority
  const bubbleStyles = useMemo(() => {
     let bgColor = 'rgba(255, 255, 255, 0.4)';
     let borderColor = 'rgba(255, 255, 255, 0.5)';
     let shadowColor = COLORS.accentPeach;

     if (task.priority === 'high') {
         bgColor = 'rgba(255, 218, 185, 0.3)'; // Peach
         shadowColor = COLORS.accentPeach;
     } else if (task.priority === 'medium') {
         bgColor = 'rgba(255, 192, 203, 0.3)'; // Pink
         shadowColor = COLORS.accentPink;
     }

     return {
        width: task.size,
        height: task.size,
        borderRadius: task.size / 2,
        backgroundColor: bgColor,
        borderColor: borderColor,
        shadowColor: shadowColor,
     };
  }, [task]);


  return (
    <Animated.View style={[styles.bubbleWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        delayLongPress={300} // Require deliberate hold/swipe up intent
        style={[styles.taskBubble, bubbleStyles]}
        accessibilityRole="button"
        accessibilityLabel={`Task: ${task.title}. Long press to complete.`}
        accessibilityHint="Dissipates the task"
      >
        <Text style={styles.bubbleText} numberOfLines={3}>{task.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Environment Card with Tactile Feedback
const EnvCard = ({ env, isActive, onSelect }) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.envCard,
                    isActive && styles.envCardActive
                ]}
                onPress={() => onSelect(env.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Environment: ${env.title}`}
            >
                <Text style={[
                    styles.envCardText,
                    isActive && styles.envCardTextActive
                ]}>{env.title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

// 3. Sensory Environment Selector
const EnvironmentSelector = ({ activeEnv, onSelect }) => {
    return (
        <View style={styles.envContainer}>
            <Text style={styles.sectionTitle}>The Chamber</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.envScroll}>
                {ENVIRONMENTS.map((env) => {
                    const isActive = activeEnv === env.id;
                    return (
                        <EnvCard
                            key={env.id}
                            env={env}
                            isActive={isActive}
                            onSelect={onSelect}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

// --- MAIN APP ENTRY POINT ---
export default function App() {
  const [isCentered, setIsCentered] = useState(false);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeEnv, setActiveEnv] = useState(ENVIRONMENTS[0].id);

  // Background color transition based on environment
  const bgProgress = useSharedValue(0);

  useEffect(() => {
    bgProgress.value = withTiming(bgProgress.value === 0 ? 1 : 0, { duration: 2000 });
  }, [activeEnv, bgProgress]);

  const bgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        bgProgress.value === 1 ? COLORS.surface : COLORS.background,
        { duration: 1000 }
      ),
    };
  });


  const handleDissipate = useCallback((id) => {
    setTasks((prev) => prev.filter(t => t.id !== id));
  }, []);

  if (!isCentered) {
    return <CenteringScreen onComplete={() => setIsCentered(true)} />;
  }

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Aether</Text>
            <Text style={styles.headerSubtitle}>Curate your headspace</Text>
        </View>

        {/* Task Area (Vapor) */}
        <View style={styles.tasksContainer}>
            {tasks.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Flow State Achieved.</Text>
                </View>
            ) : (
                <View style={styles.bubblesArea}>
                    {tasks.map((task, index) => (
                        <TaskBubble
                            key={task.id}
                            task={task}
                            onDissipate={handleDissipate}
                        />
                    ))}
                </View>
            )}
        </View>

        {/* Environment Selector */}
        <View style={styles.bottomSection}>
             <EnvironmentSelector activeEnv={activeEnv} onSelect={setActiveEnv} />
        </View>

      </SafeAreaView>
    </Animated.View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 40,
    fontFamily: 'System', // Fallback to system sans-serif
  },
  subText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 40,
    fontWeight: '300',
  },
  breathingRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.accentPeach,
    backgroundColor: 'rgba(255, 218, 185, 0.1)', // Soft peach glow
    shadowColor: COLORS.accentPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '300',
    marginTop: 8,
  },
  tasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '300',
    letterSpacing: 1,
  },
  bubblesArea: {
    width: '100%',
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20, // Requires newer React Native versions, fallback to margins if needed
    padding: 20,
  },
  bubbleWrapper: {
    margin: 10,
  },
  taskBubble: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    // Soft highlight technique (mimicking glassmorphism without heavy blur libs)
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 3,
  },
  bubbleText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  bottomSection: {
    paddingBottom: 40,
  },
  envContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: COLORS.textSecondary,
    marginBottom: 16,
    fontWeight: '600',
  },
  envScroll: {
    paddingRight: 24,
  },
  envCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  envCardActive: {
    backgroundColor: COLORS.accentPeach,
    borderColor: COLORS.accentPeach,
  },
  envCardText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '400',
  },
  envCardTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
});
