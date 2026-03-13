import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated as RNAnimated, Easing as RNEasing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolateColor,
  Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Check, Plus, Wind, Activity, Zap, Moon } from 'lucide-react-native';

const INITIAL_TASKS = [
  { id: '1', title: 'Morning Alignment', type: 'startup', energy: 'low', time: '08:00 AM', completed: false },
  { id: '2', title: 'Deep Work: System Architecture', type: 'deep_work', energy: 'peak', time: '10:30 AM', completed: false },
  { id: '3', title: 'Team Sync & Unblock', type: 'admin', energy: 'medium', time: '02:00 PM', completed: false },
  { id: '4', title: 'Creative Brainstorm', type: 'creative', energy: 'peak', time: '04:00 PM', completed: false },
  { id: '5', title: 'Daily Review & Disconnect', type: 'shutdown', energy: 'low', time: '06:30 PM', completed: false },
];

const COLORS = {
  background: '#FAFAFA',
  textPrimary: '#2F4F4F', // Dark slate gray as requested
  textSecondary: '#7F8C8D',
  etherealBlue: '#FFDAB9', // Soft Peach
  mutedAmber: '#FFC0CB',   // Blush Pink
  softMint: '#FFDAB9',     // Soft Peach
  lavender: '#FFC0CB',     // Blush Pink
  white: '#FFFFFF',
};

// --- Components ---

const FocusBreathingOverlay = ({ visible, onClose }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 500 });
      scale.value = withTiming(1);
    }
  }, [visible]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFillObject, styles.breathingOverlay, animatedOverlayStyle]}
    >
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFillObject} />
      <Animated.View style={[styles.breathingCircle, animatedCircleStyle]} />
      <Text style={styles.breathingText}>Breathe deeply to unlock focus...</Text>
      <TouchableOpacity style={styles.breathingCloseBtn} onPress={onClose}>
        <Text style={styles.breathingCloseText}>Begin</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TaskCard = memo(({ task, onToggle, onActivateFocus }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const isPeak = task.energy === 'peak';

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, []);

  const handleToggle = useCallback(() => {
    onToggle(task.id);
  }, [task.id, onToggle]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: withTiming(task.completed ? -10 : 0, { duration: 300 }) }
    ],
    opacity: withTiming(task.completed ? 0.6 : 1, { duration: 300 }),
  }));

  const getIcon = () => {
    switch (task.type) {
      case 'deep_work': return <Zap size={20} color={COLORS.etherealBlue} />;
      case 'creative': return <Wind size={20} color={COLORS.mutedAmber} />;
      case 'startup': return <Activity size={20} color={COLORS.softMint} />;
      case 'shutdown': return <Moon size={20} color={COLORS.lavender} />;
      default: return <Activity size={20} color={COLORS.textSecondary} />;
    }
  };

  return (
    <Animated.View style={[styles.taskCardContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={isPeak && !task.completed ? () => onActivateFocus(task) : handleToggle}
        style={[
          styles.taskCard,
          isPeak && !task.completed && styles.taskCardPeak,
          task.completed && styles.taskCardCompleted
        ]}
        accessibilityRole="button"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={`Task: ${task.title}`}
      >
        <View style={styles.taskLeft}>
          <TouchableOpacity
            style={[styles.checkbox, task.completed && styles.checkboxChecked]}
            onPress={handleToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            accessibilityLabel="Toggle task completion"
          >
            {task.completed && <Check size={14} color={COLORS.white} />}
          </TouchableOpacity>
          <View style={styles.taskInfo}>
            <Text style={[styles.taskTitle, task.completed && styles.textCompleted]}>
              {task.title}
            </Text>
            <Text style={styles.taskTime}>{task.time}</Text>
          </View>
        </View>
        <View style={styles.taskIcon}>
          {getIcon()}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [focusModeVisible, setFocusModeVisible] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const activateFocus = useCallback((task) => {
    setActiveTask(task);
    setFocusModeVisible(true);
  }, []);

  const endFocusMode = useCallback(() => {
    setFocusModeVisible(false);
    if (activeTask) {
      // Could mark active task as started or something
      setActiveTask(null);
    }
  }, [activeTask]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.appName}>Lumina Flow</Text>
          <Text style={styles.subtitle}>Aligning with your circadian rhythm</Text>
        </View>

        <View style={styles.timelineContainer}>
          <View style={styles.arcLine} />
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onActivateFocus={activateFocus}
            />
          ))}
        </View>

        {/* Spacer for Floating Action Menu */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Menu (Orb) */}
      <View style={styles.famContainer}>
        <BlurView intensity={20} tint="light" style={styles.famBlur}>
          <TouchableOpacity
            style={styles.famButton}
            accessibilityRole="button"
            accessibilityLabel="Add new task"
          >
            <Plus size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </BlurView>
      </View>

      <FocusBreathingOverlay
        visible={focusModeVisible}
        onClose={endFocusMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '400',
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: '300',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    fontFamily: 'System',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
  timelineContainer: {
    position: 'relative',
    gap: 20,
  },
  arcLine: {
    position: 'absolute',
    left: 20,
    top: 20,
    bottom: 20,
    width: 2,
    backgroundColor: 'rgba(115, 166, 173, 0.1)',
    borderRadius: 1,
    zIndex: -1,
  },
  taskCardContainer: {
    width: '100%',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    // Ambient Occlusion style shadow
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  taskCardPeak: {
    shadowColor: COLORS.etherealBlue,
    shadowOpacity: 0.15,
    shadowRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(115, 166, 173, 0.1)',
  },
  taskCardCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowOpacity: 0,
    elevation: 0,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(44, 62, 80, 0.2)',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.textSecondary,
    borderColor: COLORS.textSecondary,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
    opacity: 0.6,
  },
  taskTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  famContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    borderRadius: 30,
    overflow: 'hidden',
  },
  famBlur: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  famButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingOverlay: {
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.etherealBlue,
    opacity: 0.1,
    position: 'absolute',
  },
  breathingText: {
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginBottom: 40,
    letterSpacing: 1,
  },
  breathingCloseBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  breathingCloseText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
});
