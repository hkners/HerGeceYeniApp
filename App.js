import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS,
  FadeInUp,
  FadeOutDown,
  Layout
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Data
const TASKS = [
  { id: '1', title: 'Water the plants', category: 'low', energyReq: 1 },
  { id: '2', title: 'Reply to emails', category: 'low', energyReq: 2 },
  { id: '3', title: 'Read a chapter', category: 'low', energyReq: 2 },
  { id: '4', title: 'Review PRs', category: 'medium', energyReq: 4 },
  { id: '5', title: 'Plan weekly meals', category: 'medium', energyReq: 4 },
  { id: '6', title: 'Deep Work: Project X', category: 'high', energyReq: 8 },
  { id: '7', title: 'Write architecture doc', category: 'high', energyReq: 7 },
  { id: '8', title: 'Workout', category: 'high', energyReq: 6 },
];

const DIAL_WIDTH = width - 48;

// Colors
const COLORS = {
  bg: '#FAFAFA',
  cardBg: 'rgba(255, 255, 255, 0.6)', // Simulated glassmorphism
  textDark: '#2D3436', // Soft Charcoal
  textLight: '#8A8A8E',
  highlightLow: '#FFDAB9', // Soft peach
  highlightMid: '#FFDAB9', // Soft peach
  highlightHigh: '#FFC0CB', // Blush pink
  orbLow: '#FFDAB9',
  orbMid: '#FFDAB9',
  orbHigh: '#FFC0CB',
};

// --- Components ---

const TaskCard = ({ task, onComplete }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handleComplete = () => {
    opacity.value = withTiming(0, { duration: 400 }, () => {
      runOnJS(onComplete)(task.id);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleComplete}
    >
      <Animated.View style={[styles.taskCard, animatedStyle]}>
        <View style={styles.taskCardContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.taskMeta}>
            <View style={[
              styles.energyDot,
              { backgroundColor: task.category === 'low' ? COLORS.highlightLow : task.category === 'medium' ? COLORS.highlightMid : COLORS.highlightHigh }
            ]} />
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(TASKS);
  const [energyLevel, setEnergyLevel] = useState(0.5); // 0 to 1
  const [focusModeTask, setFocusModeTask] = useState(null);

  // --- Animation Values ---
  const dialX = useSharedValue(DIAL_WIDTH * 0.5);
  const dialScale = useSharedValue(1);

  // --- Logic ---
  const filteredTasks = useMemo(() => {
    // 0.0 - 0.33: Low Energy
    // 0.34 - 0.66: Medium Energy
    // 0.67 - 1.0: High Energy

    return [...tasks].sort((a, b) => {
      // Calculate a "fitness" score for each task based on current energy level
      const currentEnergyReq = energyLevel * 10;

      const diffA = Math.abs(a.energyReq - currentEnergyReq);
      const diffB = Math.abs(b.energyReq - currentEnergyReq);

      return diffA - diffB;
    });
  }, [tasks, energyLevel]);

  const handleCompleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  // --- Interactions ---
  const handleDialPress = (e) => {
    const x = Math.max(0, Math.min(e.nativeEvent.locationX, DIAL_WIDTH));
    dialX.value = withSpring(x, { damping: 20, stiffness: 100 });
    setEnergyLevel(x / DIAL_WIDTH);
  };

  const handleDialPressIn = () => {
    dialScale.value = withSpring(1.05, { damping: 15, stiffness: 200 });
  };

  const handleDialPressOut = () => {
    dialScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  // --- Styles ---
  const dialAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: dialX.value - 24 }, // Center the knob
        { scale: dialScale.value }
      ]
    };
  });

  const appBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: COLORS.bg,
    };
  });

  const orbBgStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      dialX.value,
      [0, DIAL_WIDTH / 2, DIAL_WIDTH],
      [COLORS.orbLow, COLORS.orbMid, COLORS.orbHigh]
    );
    return {
      backgroundColor: bg,
    };
  });

  return (
    <Animated.View style={[styles.container, appBgStyle]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lume</Text>
          <Text style={styles.subtitle}>Illuminate your intentional day.</Text>
        </View>

        {/* Energy Dial Area */}
        <View style={styles.dialContainer}>
          <Text style={styles.sectionLabel}>How are you feeling?</Text>

          <TouchableWithoutFeedback
            onPress={handleDialPress}
            onPressIn={handleDialPressIn}
            onPressOut={handleDialPressOut}
          >
            <View style={styles.dialTrack}>
              {/* Minimalist gradient track simulation */}
              <View style={styles.trackSegmentsContainer}>
                <View style={[styles.trackSegment, {backgroundColor: COLORS.highlightLow}]} />
                <View style={[styles.trackSegment, {backgroundColor: COLORS.highlightMid}]} />
                <View style={[styles.trackSegment, {backgroundColor: COLORS.highlightHigh}]} />
              </View>

              <Animated.View pointerEvents="none" style={[styles.dialKnob, dialAnimatedStyle, orbBgStyle]}>
                 <View style={styles.knobInner} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.dialLabels}>
            <Text style={styles.dialLabel}>Zen</Text>
            <Text style={styles.dialLabel}>Flow</Text>
          </View>
        </View>

        {/* Task List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
        >
          {filteredTasks.map((task) => (
            <Animated.View
              key={task.id}
              entering={FadeInUp.springify().damping(15).stiffness(100)}
              layout={Layout.springify().damping(18).stiffness(120)}
            >
              <TaskCard task={task} onComplete={handleCompleteTask} />
            </Animated.View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.textDark,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 8,
    fontWeight: '300',
  },
  dialContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  dialTrack: {
    width: DIAL_WIDTH,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  trackSegmentsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    borderRadius: 30,
    overflow: 'hidden',
  },
  trackSegment: {
    flex: 1,
    height: '100%',
    opacity: 0.3,
  },
  dialKnob: {
    position: 'absolute',
    top: 6,
    left: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.orbMid,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knobInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  dialLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DIAL_WIDTH,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  dialLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  taskList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  taskCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});