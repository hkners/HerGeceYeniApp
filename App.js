import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Play, Pause, Square, Check, Volume2, VolumeX, Flame } from 'lucide-react-native';
import { create } from 'zustand';

// --- STORES ---
const useStore = create((set) => ({
  isTimerRunning: false,
  timeLeft: 25 * 60, // 25 mins
  isSoundPlaying: false,
  activeTask: null,
  tasks: [
    { id: '1', title: 'Draft Product Spec', duration: '25m', color: '#FFC0CB', completed: false }, // Blush Pink
    { id: '2', title: 'Review PRs', duration: '15m', color: '#FFDAB9', completed: false }, // Soft Peach
    { id: '3', title: 'Update Dependencies', duration: '10m', color: '#E6E6FA', completed: true }, // Pale Lavender
  ],
  toggleTimer: () => set((state) => ({ isTimerRunning: !state.isTimerRunning })),
  tickTimer: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
  resetTimer: () => set({ timeLeft: 25 * 60, isTimerRunning: false }),
  toggleSound: () => set((state) => ({ isSoundPlaying: !state.isSoundPlaying })),
  setActiveTask: (id) => set({ activeTask: id }),
  toggleTaskCompletion: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
}));

// --- COMPONENTS ---

// 1. Task Card
const TaskCard = ({ task }) => {
  const { activeTask, setActiveTask, toggleTaskCompletion } = useStore();
  const scale = useSharedValue(1);
  const isActive = activeTask === task.id;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: withTiming(isActive ? task.color : 'transparent', { duration: 300 }),
    backgroundColor: withTiming(isActive ? '#FFFFFF' : '#FAFAFA', { duration: 300 }),
    shadowOpacity: withTiming(isActive ? 0.1 : 0.0, { duration: 300 }),
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.selectionAsync();
    setActiveTask(task.id);
  };

  const handleToggle = () => {
    Haptics.notificationAsync(
      task.completed ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success
    );
    toggleTaskCompletion(task.id);
  };

  return (
    <Animated.View style={[styles.taskCardContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.taskCardContent}
        accessibilityRole="button"
        accessibilityLabel={`Task: ${task.title}`}
        accessibilityState={{ selected: isActive }}
      >
        <View style={styles.taskLeft}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            accessibilityLabel={`Toggle completion for ${task.title}`}
          >
            <View style={[styles.checkbox, { borderColor: task.completed ? task.color : '#E0E0E0', backgroundColor: task.completed ? task.color : 'transparent' }]}>
               {task.completed && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </View>
          </TouchableOpacity>
          <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
            {task.title}
          </Text>
        </View>
        <View style={styles.taskRight}>
          <Text style={styles.taskDuration}>{task.duration}</Text>
          <View style={[styles.taskColorIndicator, { backgroundColor: task.color }]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 2. Focus Timer
const FocusTimer = () => {
  const { timeLeft, isTimerRunning, toggleTimer, resetTimer } = useStore();

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        useStore.getState().tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      pulseScale.value = withRepeat(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [isTimerRunning]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    shadowOpacity: withTiming(isTimerRunning ? 0.15 : 0.05, { duration: 500 }),
    backgroundColor: withTiming(isTimerRunning ? '#FFFFFF' : '#FAFAFA', { duration: 500 }),
  }));

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleTimer();
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetTimer();
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <View style={styles.timerContainer}>
      <Animated.View style={[styles.timerCircle, animatedCircleStyle]}>
        <View style={styles.timerInnerCircle}>
          <Text style={styles.timerText}>{minutes}:{seconds}</Text>
          <Text style={styles.timerLabel}>Focus Time</Text>
        </View>
      </Animated.View>

      <View style={styles.timerControls}>
        <TouchableOpacity style={styles.controlButtonSecondary} onPress={handleReset} accessibilityRole="button" accessibilityLabel="Reset Timer">
          <Square size={20} color="#71717A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButtonPrimary} onPress={handleToggle} accessibilityRole="button" accessibilityLabel={isTimerRunning ? "Pause Timer" : "Start Timer"}>
          {isTimerRunning ? (
            <Pause size={24} color="#2D2D2D" fill="#2D2D2D" />
          ) : (
            <Play size={24} color="#2D2D2D" fill="#2D2D2D" style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>
        <AmbientSoundToggle />
      </View>
    </View>
  );
};

// 3. Ambient Sound Toggle
const AmbientSoundToggle = () => {
  const { isSoundPlaying, toggleSound } = useStore();
  const [sound, setSound] = useState(null);

  // Mock sound playback for the prototype
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleToggle = async () => {
    Haptics.selectionAsync();
    toggleSound();
    // In a real app, we'd play actual audio here.
    // For the prototype, we just mock the visual state.
  };

  return (
    <TouchableOpacity
      style={[styles.controlButtonSecondary, isSoundPlaying && styles.controlButtonActive]}
      onPress={handleToggle}
      accessibilityRole="button"
      accessibilityLabel="Toggle Ambient Sound"
    >
      {isSoundPlaying ? (
        <Volume2 size={20} color="#FFDAB9" />
      ) : (
        <VolumeX size={20} color="#71717A" />
      )}
    </TouchableOpacity>
  );
};

// --- MAIN APP ---
export default function App() {
  const tasks = useStore((state) => state.tasks);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Background with ethereal feel */}
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.title}>Deep Work</Text>
          <Text style={styles.subtitle}>Minimize distractions. Maximize clarity.</Text>
        </View>

        {/* Timer Section */}
        <FocusTimer />

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
             <Text style={styles.sectionTitle}>Essential Tasks</Text>
             <Flame size={18} color="#FFC0CB" />
          </View>

          <View style={styles.taskList}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure White for Clean Girl aesthetic
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: 300,
    height: 300,
    backgroundColor: '#FFDAB9', // Soft Peach
    borderRadius: 150,
    opacity: 0.15,
    filter: 'blur(60px)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -50,
    width: 300,
    height: 300,
    backgroundColor: '#FFC0CB', // Blush Pink
    borderRadius: 150,
    opacity: 0.15,
    filter: 'blur(60px)',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A0A0AB',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2D2D2D', // Dark Slate Gray
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
  },

  // Timer Styles
  timerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  timerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F4F4F5',
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 4,
    marginBottom: 32,
  },
  timerInnerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FAFAFA',
  },
  timerText: {
    fontSize: 56,
    fontWeight: '200',
    color: '#2D2D2D',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A0A0AB',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlButtonPrimary: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F4F4F5',
  },
  controlButtonSecondary: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F4F4F5',
  },
  controlButtonActive: {
    backgroundColor: '#FFF0F5', // Very light blush
    borderColor: '#FFC0CB',
  },

  // Task Styles
  tasksSection: {
    flex: 1,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    letterSpacing: 0.5,
  },
  taskList: {
    gap: 12,
  },
  taskCardContainer: {
    borderRadius: 20, // Soft rounded corners
    borderWidth: 1,
    borderColor: 'transparent', // Will be animated
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  taskCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxContainer: {
    padding: 4,
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4A4A4A',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#A0A0AB',
  },
  taskRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A0A0AB',
  },
  taskColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
