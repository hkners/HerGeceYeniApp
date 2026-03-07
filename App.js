import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  FadeIn,
  FadeOutUp,
  Layout
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Canvas, Rect, SweepGradient, vec, Circle, BlurMask } from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import { CheckCircle2, Circle as CircleIcon, LayoutDashboard, Zap, BookOpen } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const INITIAL_TASKS = [
  { id: '1', text: 'Morning Yoga at 6am', completed: false },
  { id: '2', text: 'Drink 2L of water', completed: false },
  { id: '3', text: 'Read 10 pages of a book', completed: false },
];

const TaskItem = ({ task, onComplete }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onComplete(task.id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp.duration(400).delay(100)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Complete task: ${task.text}`}
      >
        <Animated.View style={[styles.taskCard, animatedStyle]}>
          <Text style={styles.taskText}>{task.text}</Text>
          <CircleIcon color="#FFC0CB" size={24} strokeWidth={1.25} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [focusMode, setFocusMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  // Pulse animation
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000 }),
        withTiming(1, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }]
  }));

  const mainUiOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(focusMode ? 0.1 : 1, { duration: 500 })
  }));

  const completeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setTasks([...tasks, { id: Date.now().toString(), text: newTaskText, completed: false }]);
      setNewTaskText('');
      setIsAdding(false);
    }
  };

  const toggleFocusMode = () => {
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setFocusMode(!focusMode);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Skia Canvas */}
      <View style={StyleSheet.absoluteFill}>
        <Canvas style={{ flex: 1 }}>
           <Circle c={vec(0, 0)} r={300} color="#FFDAB9" opacity={0.15}>
             <BlurMask blur={50} style="normal" />
           </Circle>
           <Circle c={vec(width, height / 2)} r={250} color="#FFC0CB" opacity={0.1}>
             <BlurMask blur={50} style="normal" />
           </Circle>
        </Canvas>
      </View>

      <Animated.View style={[styles.content, mainUiOpacity]}>
        {/* Header / Pulse */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleFocusMode}
            style={styles.pulseWrapper}
            accessibilityRole="button"
            accessibilityLabel="Toggle Focus Mode"
          >
            <Animated.View style={[styles.pulseOrb, pulseAnimatedStyle]}>
              <Canvas style={{ flex: 1 }}>
                <Circle c={vec(50, 50)} r={50} color="#FFDAB9" opacity={0.5}>
                    <BlurMask blur={10} style="normal" />
                </Circle>
              </Canvas>
            </Animated.View>
            <Text style={styles.pulseText}>{focusMode ? "Focusing" : "Aura"}</Text>
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onComplete={completeTask} />
          ))}
          {tasks.length === 0 && (
            <Text style={styles.emptyText}>Breathe. You have no tasks left.</Text>
          )}
        </ScrollView>
      </Animated.View>

      {/* FAB & Input */}
      {!focusMode && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.fabContainer}
          pointerEvents="box-none"
        >
          {isAdding ? (
            <Animated.View entering={FadeIn} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="What is your intent?"
                placeholderTextColor="#A0A0A0"
                value={newTaskText}
                onChangeText={setNewTaskText}
                onSubmitEditing={addTask}
                autoFocus
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <TouchableOpacity
              style={styles.fab}
              onPress={() => {
                if(Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsAdding(true);
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Add Task"
            >
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      )}

      {/* Bottom Nav */}
      <Animated.View style={[styles.bottomNavWrapper, mainUiOpacity]}>
        <BlurView intensity={50} tint="light" style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
             <LayoutDashboard color="#2D3436" size={24} strokeWidth={1.25} />
            <Text style={[styles.navText, styles.navTextActive]}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={toggleFocusMode}>
            <Zap color="#A0A0A0" size={24} strokeWidth={1.25} />
            <Text style={styles.navText}>Flow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <BookOpen color="#A0A0A0" size={24} strokeWidth={1.25} />
            <Text style={styles.navText}>Reflection</Text>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  pulseWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  pulseOrb: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  pulseText: {
    fontSize: 20,
    fontWeight: '300',
    color: '#2D3436',
    letterSpacing: 1,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '400',
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#A0A0A0',
    marginTop: 40,
    fontSize: 16,
    fontWeight: '300',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  fabText: {
    fontSize: 28,
    color: '#2D3436',
    fontWeight: '300',
    lineHeight: 32,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    padding: 8,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: '#FFC0CB', // Blush pink
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navText: {
    fontSize: 12,
    color: '#A0A0A0',
    fontWeight: '400',
    marginTop: 4,
  },
  navTextActive: {
    color: '#2D3436',
    fontWeight: '600',
  }
});