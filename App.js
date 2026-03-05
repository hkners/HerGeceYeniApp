import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { Feather, Ionicons } from '@expo/vector-icons';

// Dummy Data
const INITIAL_TASKS = [
  { id: '1', title: 'Write Q3 Strategy Doc', priority: 'high', completed: false },
  { id: '2', title: 'Review Design System', priority: 'medium', completed: false },
  { id: '3', title: 'Reply to Client Emails', priority: 'low', completed: true },
];

const AMBIENT_SOUNDS = [
  { id: 'rain', icon: 'cloud-drizzle', name: 'Rain' },
  { id: 'wind', icon: 'wind', name: 'Wind' },
  { id: 'coffee', icon: 'coffee', name: 'Cafe' },
];

// --- Components ---

const PressableScale = ({ children, onPress, style }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const CustomCheckbox = ({ checked, onPress }) => {
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 300, easing: Easing.out(Easing.ease) });
  }, [checked, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], ['#FFFFFF', '#FFDAB9']),
      borderColor: interpolateColor(progress.value, [0, 1], ['#E0E0E0', '#FFDAB9']),
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }],
    };
  });

  return (
    <PressableScale onPress={onPress}>
      <Animated.View style={[styles.checkbox, animatedStyle]}>
        <Animated.View style={checkmarkStyle}>
          <Feather name="check" size={12} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </PressableScale>
  );
};

const TaskItem = ({ task, onToggle }) => {
  const getHighlightColor = () => {
    if (task.completed) return 'transparent';
    if (task.priority === 'high') return '#FFC0CB20'; // Soft blush pink highlight
    if (task.priority === 'medium') return '#FFDAB920'; // Soft peach highlight
    return 'transparent';
  };

  return (
    <View style={[styles.taskItem, { backgroundColor: getHighlightColor() }]}>
      <CustomCheckbox checked={task.completed} onPress={() => onToggle(task.id)} />
      <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
        {task.title}
      </Text>
    </View>
  );
};

export default function LuminaWorkspace() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeSound, setActiveSound] = useState(null);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTask = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / (25 * 60));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.title}>Lumina Workspace</Text>
        </View>

        {/* Focus Timer Section */}
        <View style={styles.timerSection}>
           <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>Deep Work</Text>
           </View>

           <PressableScale
             style={[styles.playButton, isActive ? styles.pauseButton : null]}
             onPress={() => setIsActive(!isActive)}
           >
              <Ionicons name={isActive ? "pause" : "play"} size={24} color={isActive ? "#4A4A4A" : "#FFFFFF"} />
           </PressableScale>
        </View>

        {/* Ambient Sounds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ambient Soundscape</Text>
          <View style={styles.soundRow}>
            {AMBIENT_SOUNDS.map((sound) => (
              <PressableScale
                key={sound.id}
                style={[
                  styles.soundButton,
                  activeSound === sound.id && styles.soundButtonActive
                ]}
                onPress={() => setActiveSound(sound.id === activeSound ? null : sound.id)}
              >
                <Feather
                  name={sound.icon}
                  size={24}
                  color={activeSound === sound.id ? "#FFDAB9" : "#A0A0A0"}
                />
              </PressableScale>
            ))}
          </View>
        </View>

        {/* Task List Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Essential Tasks</Text>
          <View style={styles.taskList}>
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Ultra-light off-white
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 4,
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333333', // Premium dark slate gray
    letterSpacing: -0.5,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFDAB9', // Soft peach glow
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 5,
    marginBottom: -28, // Overlap the button slightly
    borderWidth: 1,
    borderColor: '#FAFAFA',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333333',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFDAB9', // Soft peach accent
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  pauseButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4A4A4A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  soundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  soundButton: {
    flex: 1,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  soundButtonActive: {
    borderColor: '#FFDAB9',
    backgroundColor: '#FFDAB910', // Very light peach background
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskText: {
    fontSize: 16,
    color: '#4A4A4A',
    fontWeight: '400',
    flex: 1,
  },
  taskTextCompleted: {
    color: '#B0B0B0',
    textDecorationLine: 'line-through',
  },
  timerRingContainer: {
    position: 'absolute',
    borderColor: '#F0F0F0',
  },
  timerRingInner: {
    flex: 1,
    borderRadius: 999,
  }
});
