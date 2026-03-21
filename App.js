import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSpring,
  Easing,
  runOnJS,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

// Core colors defined in requirements
const COLORS = {
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  peach: '#FFDAB9',
  pink: '#FFC0CB',
  slateGray: '#4A5568', // Dark slate gray (avoid pure black)
  lightSlate: '#718096',
};

// Mock data
const INITIAL_TASKS = [
  { id: '1', title: 'Morning meditation (10m)', active: true },
  { id: '2', title: 'Review weekly goals', active: true },
  { id: '3', title: 'Water indoor plants', active: true },
];

const INITIAL_WHISPERS = [
  { id: '1', text: 'Feeling calm this morning.', color: COLORS.peach },
];

// --- Components ---

// Pulsating Aura Orb
const Aura = memo(({ taskCount }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    // Dynamic sizing based on workload (taskCount)
    const baseScale = Math.max(0.8, Math.min(1.5, taskCount * 0.2 + 0.8));

    // Smooth breathing animation
    scale.value = withRepeat(
      withTiming(baseScale * 1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    return () => {
       scale.value = baseScale;
       opacity.value = 0.6;
    };
  }, [taskCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.auraContainer} pointerEvents="none">
      <Animated.View style={[styles.auraOrb, animatedStyle]} pointerEvents="none" />
      <Animated.View style={[styles.auraOrbInner, animatedStyle]} pointerEvents="none" />
    </View>
  );
});

// "Breath" Task Card
const TaskCard = memo(({ task, onComplete }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const [isCompleting, setIsCompleting] = useState(false);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleComplete = () => {
    if (isCompleting) return;
    setIsCompleting(true);

    // Dissolve effect
    scale.value = withTiming(0.8, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onComplete)(task.id);
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.taskCard, animatedStyle]}
      entering={FadeInUp.duration(400)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleComplete}
        style={styles.taskTouchable}
        accessibilityRole="button"
        accessibilityLabel={`Complete task: ${task.title}`}
        accessibilityHint="Double tap to dissolve and complete task"
      >
        <View style={styles.taskIndicator} />
        <Text style={styles.taskText}>{task.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Whisper Card
const WhisperCard = memo(({ whisper }) => {
  return (
    <Animated.View
      style={[styles.whisperCard, { shadowColor: whisper.color }]}
      entering={FadeInUp.duration(500)}
    >
       <View style={[styles.whisperGlow, { backgroundColor: whisper.color }]} />
       <Text style={styles.whisperText}>{whisper.text}</Text>
    </Animated.View>
  );
});

// --- Main App ---

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [whispers, setWhispers] = useState(INITIAL_WHISPERS);
  const [inputText, setInputText] = useState('');

  const handleCompleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const handleReleaseWhisper = () => {
    if (!inputText.trim()) return;

    // Simple sentiment mock (alternate colors)
    const newColor = whispers.length % 2 === 0 ? COLORS.peach : COLORS.pink;

    const newWhisper = {
      id: Date.now().toString(),
      text: inputText.trim(),
      color: newColor,
    };

    setWhispers((prev) => [newWhisper, ...prev]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Aura taskCount={tasks.length} />

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Luma</Text>
            <Text style={styles.headerSubtitle}>Clear your space, find your light.</Text>
          </View>

          {/* Whisper Entry */}
          <View style={styles.whisperInputContainer}>
            <TextInput
              style={styles.whisperInput}
              placeholder="Release a thought..."
              placeholderTextColor={COLORS.lightSlate}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleReleaseWhisper}
              returnKeyType="done"
            />
          </View>

          {/* Whispers Feed */}
          {whispers.length > 0 && (
            <View style={styles.section}>
              {whispers.map((whisper) => (
                <WhisperCard key={whisper.id} whisper={whisper} />
              ))}
            </View>
          )}

          {/* Tasks List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breath Tasks</Text>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                />
              ))
            ) : (
              <Animated.View entering={FadeInUp} style={styles.emptyState}>
                <Text style={styles.emptyText}>Space cleared.</Text>
              </Animated.View>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  // Aura Styles
  auraContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  auraOrb: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.peach,
    position: 'absolute',
    opacity: 0.2,
  },
  auraOrbInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.pink,
    position: 'absolute',
    opacity: 0.3,
  },
  // Header Styles
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.slateGray,
    letterSpacing: 4,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: COLORS.lightSlate,
    letterSpacing: 1,
  },
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.lightSlate,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
    marginLeft: 8,
  },
  // Whisper Input
  whisperInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 32,
    shadowColor: COLORS.slateGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  whisperInput: {
    fontSize: 16,
    color: COLORS.slateGray,
    fontWeight: '300',
  },
  // Whisper Card
  whisperCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  whisperGlow: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 16,
  },
  whisperText: {
    fontSize: 15,
    color: COLORS.slateGray,
    fontWeight: '400',
    flex: 1,
    lineHeight: 22,
  },
  // Task Card
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  taskTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  taskIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.lightSlate,
    marginRight: 16,
  },
  taskText: {
    fontSize: 16,
    color: COLORS.slateGray,
    fontWeight: '300',
  },
  // Empty State
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.lightSlate,
    fontWeight: '300',
    fontStyle: 'italic',
  },
});
