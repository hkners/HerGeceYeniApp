import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Modes
const MODES = {
  FOCUS: 'FOCUS',
  REFLECTION: 'REFLECTION',
  PLANNING: 'PLANNING',
};

const MODE_COLORS = {
  [MODES.FOCUS]: { bg: '#FAFAFA', orb: '#E0F7FA', highlight: '#FFECD2', border: '#FFECD2' }, // Mint Mist / Soft Peach
  [MODES.REFLECTION]: { bg: '#FAFAFA', orb: '#F3E5F5', highlight: '#FFC0CB', border: '#F3E5F5' }, // Lavender / Blush Pink
  [MODES.PLANNING]: { bg: '#F8F9FB', orb: '#FFECD2', highlight: '#E0F7FA', border: '#E0F7FA' }, // Soft Peach / Mint Mist
};

const TASKS = [
  { id: 1, title: 'Deep Work: Strategy', weight: 'heavy', duration: 120 },
  { id: 2, title: 'Review Product Specs', weight: 'medium', duration: 60 },
  { id: 3, title: 'Quick Sync', weight: 'light', duration: 15 },
];

export default function App() {
  const [currentMode, setCurrentMode] = useState(MODES.REFLECTION);
  const [journalEntry, setJournalEntry] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);

  // Orb Animation values
  const orbScale = useSharedValue(1);
  const orbPulse = useSharedValue(1);
  const orbRotation = useSharedValue(0);

  // Background transition
  const bgProgress = useSharedValue(0);

  useEffect(() => {
    // Start the breathing pulse animation
    orbPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Continuous slow rotation
    orbRotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    // Background color transition progress
    bgProgress.value = withTiming(
      currentMode === MODES.FOCUS ? 0 : currentMode === MODES.REFLECTION ? 0.5 : 1,
      { duration: 800, easing: Easing.out(Easing.quad) }
    );
  }, [currentMode]);

  const animatedBgStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      bgProgress.value,
      [0, 0.5, 1],
      [MODE_COLORS[MODES.FOCUS].bg, MODE_COLORS[MODES.REFLECTION].bg, MODE_COLORS[MODES.PLANNING].bg]
    );
    return { backgroundColor: bgColor };
  });

  const animatedOrbStyle = useAnimatedStyle(() => {
    const orbColor = interpolateColor(
      bgProgress.value,
      [0, 0.5, 1],
      [MODE_COLORS[MODES.FOCUS].orb, MODE_COLORS[MODES.REFLECTION].orb, MODE_COLORS[MODES.PLANNING].orb]
    );

    return {
      backgroundColor: orbColor,
      transform: [
        { scale: orbScale.value * orbPulse.value },
        { rotate: `${orbRotation.value}deg` },
      ],
      shadowColor: interpolateColor(
        bgProgress.value,
        [0, 0.5, 1],
        [MODE_COLORS[MODES.FOCUS].highlight, MODE_COLORS[MODES.REFLECTION].highlight, MODE_COLORS[MODES.PLANNING].highlight]
      ),
    };
  });

  const handleOrbPressIn = () => {
    orbScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handleOrbPressOut = () => {
    orbScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    // Cycle mode
    const modesArray = Object.values(MODES);
    const currentIndex = modesArray.indexOf(currentMode);
    setCurrentMode(modesArray[(currentIndex + 1) % modesArray.length]);
  };

  const completeTask = (id) => {
    setCompletedTasks([...completedTasks, id]);
  };

  const renderReflectionMode = () => (
    <View style={styles.modeContainer}>
      <Text style={styles.promptText}>What is your singular intention?</Text>
      <TextInput
        style={styles.journalInput}
        placeholder="Breathe and type..."
        placeholderTextColor="#B0B0B0"
        value={journalEntry}
        onChangeText={setJournalEntry}
        multiline
      />
    </View>
  );

  const renderPlanningMode = () => (
    <View style={styles.modeContainer}>
      <Text style={styles.sectionTitle}>Flows</Text>
      <View style={styles.tasksContainer}>
        {TASKS.map((task) => {
          if (completedTasks.includes(task.id)) return null;

          // Determine visual weight
          const weightScale = task.weight === 'heavy' ? 1.05 : task.weight === 'light' ? 0.95 : 1;
          const bgIntensity = task.weight === 'heavy' ? '#FFF5E6' : '#FFFFFF';

          return (
            <TaskCloud key={task.id} task={task} bgIntensity={bgIntensity} weightScale={weightScale} onComplete={() => completeTask(task.id)} />
          );
        })}
      </View>
    </View>
  );

  const renderFocusMode = () => {
    const remainingTasks = TASKS.filter((t) => !completedTasks.includes(t.id));
    const currentTask = remainingTasks.length > 0 ? remainingTasks[0] : null;

    return (
      <View style={styles.modeContainer}>
        <Text style={styles.focusLabel}>FOCUS VAULT</Text>
        {currentTask ? (
          <View style={styles.focusTaskContainer}>
            <Text style={styles.focusTaskTitle}>{currentTask.title}</Text>
            <View style={styles.focusHalo} />
          </View>
        ) : (
          <Text style={styles.focusTaskTitle}>All flows clear.</Text>
        )}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <StatusBar style="dark" />

      {/* Main Mode Content */}
      <View style={styles.contentArea}>
        {currentMode === MODES.REFLECTION && renderReflectionMode()}
        {currentMode === MODES.PLANNING && renderPlanningMode()}
        {currentMode === MODES.FOCUS && renderFocusMode()}
      </View>

      {/* The Central Orb (Navigation / Vibe Indicator) */}
      <View style={styles.orbContainer}>
        <TouchableWithoutFeedback onPressIn={handleOrbPressIn} onPressOut={handleOrbPressOut}>
          <Animated.View style={[styles.orb, animatedOrbStyle]}>
            <Text style={styles.orbText}>{currentMode === MODES.FOCUS ? 'Focus' : currentMode === MODES.REFLECTION ? 'Reflect' : 'Plan'}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </Animated.View>
  );
}

// Custom Task Component with tactile feedback
const TaskCloud = ({ task, bgIntensity, weightScale, onComplete }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * weightScale }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    onComplete();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} accessibilityRole="button">
      <Animated.View style={[styles.taskCloud, { backgroundColor: bgIntensity }, animatedStyle]}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDuration}>{task.duration}m</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 60,
  },
  contentArea: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  modeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: 150,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60, // Perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    // Glassmorphism / Glow base
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  orbText: {
    color: '#4A4A4A', // Dark slate gray
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  // Reflection Mode
  promptText: {
    fontSize: 24,
    fontWeight: '200',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  journalInput: {
    width: '100%',
    minHeight: 100,
    fontSize: 18,
    fontWeight: '300',
    color: '#4A4A4A',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FAFAFA',
  },
  // Planning Mode
  sectionTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#4A4A4A',
    marginBottom: 30,
    letterSpacing: 2,
    alignSelf: 'flex-start',
  },
  tasksContainer: {
    width: '100%',
    gap: 20,
  },
  taskCloud: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Soft highlight
    shadowColor: '#E0F7FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#4A4A4A',
  },
  taskDuration: {
    fontSize: 14,
    fontWeight: '300',
    color: '#A0A0A0',
  },
  // Focus Mode
  focusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A0A0A0',
    letterSpacing: 4,
    marginBottom: 40,
  },
  focusTaskContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 250,
  },
  focusTaskTitle: {
    fontSize: 28,
    fontWeight: '200',
    color: '#4A4A4A',
    textAlign: 'center',
    zIndex: 2,
  },
  focusHalo: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: '#E0F7FA',
    backgroundColor: 'rgba(224, 247, 250, 0.1)',
    zIndex: 1,
  },
});
