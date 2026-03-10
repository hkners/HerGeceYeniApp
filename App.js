import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, SafeAreaView, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Wind, Home, BookOpen } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FBFBFE',
  surface: 'rgba(255, 255, 255, 0.7)',
  lavender: '#FFC0CB',
  mint: '#FFDAB9',
  apricot: '#FFF7ED',
  textMain: '#2D3436',
  textMuted: '#9CA3AF',
  border: 'rgba(255, 255, 255, 0.5)',
};

const Header = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.header}>
      <Text style={styles.timeText}>{time}</Text>
      <View style={styles.clarityBadge}>
        <Text style={styles.clarityText}>84% Clarity</Text>
      </View>
    </View>
  );
};

const TaskCloud = React.memo(({ task, isActive, onPress, delay = 0 }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    ));
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    shadowColor: isActive ? COLORS.lavender : 'rgba(0,0,0,0.05)',
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.taskCloud, animatedStyle, isActive && styles.taskCloudActive]}>
        <Text style={styles.taskText}>{task.title}</Text>
        <Text style={styles.taskSubtext}>{task.duration} min</Text>
      </Animated.View>
    </Pressable>
  );
});

const ZenithTimer = ({ activeTask, isRunning, toggleTimer }) => {
  const scale = useSharedValue(0.98);

  useEffect(() => {
    if (isRunning) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.98, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      scale.value = withSpring(0.98, { stiffness: 40 });
    }
  }, [isRunning, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.zenithContainer}>
      <Animated.View style={[styles.zenithOrb, animatedStyle]}>
        <BlurView intensity={isRunning ? 30 : 100} tint="light" style={StyleSheet.absoluteFill} />
        <Pressable
          style={styles.zenithInner}
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            toggleTimer();
          }}
          accessibilityRole="button"
          accessibilityState={{ checked: isRunning }}
          accessibilityLabel={isRunning ? "Stop Focus Session" : "Start Focus Session"}
        >
          {activeTask ? (
            <>
              <Text style={styles.zenithTaskTitle}>{activeTask.title}</Text>
              <Text style={styles.zenithStatus}>{isRunning ? 'Flowing...' : 'Tap to pause'}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.zenithTaskTitle, { color: COLORS.textMuted }]}>Aether</Text>
              <Text style={styles.zenithStatus}>Select a task to begin</Text>
            </>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const HorizonNavBar = ({ activeTab, setActiveTab }) => {
  return (
    <BlurView intensity={80} tint="light" style={styles.navBar}>
      <Pressable onPress={() => setActiveTab('home')} style={styles.navItem} accessibilityRole="button" accessibilityLabel="Home">
        <Home size={24} color={activeTab === 'home' ? COLORS.textMain : COLORS.textMuted} strokeWidth={1.5} />
      </Pressable>
      <Pressable onPress={() => setActiveTab('focus')} style={styles.navItem} accessibilityRole="button" accessibilityLabel="Focus">
        <Wind size={24} color={activeTab === 'focus' ? COLORS.textMain : COLORS.textMuted} strokeWidth={1.5} />
      </Pressable>
      <Pressable onPress={() => setActiveTab('journal')} style={styles.navItem} accessibilityRole="button" accessibilityLabel="Journal">
        <BookOpen size={24} color={activeTab === 'journal' ? COLORS.textMain : COLORS.textMuted} strokeWidth={1.5} />
      </Pressable>
    </BlurView>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeTask, setActiveTask] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const tasks = [
    { id: '1', title: 'Deep Work Session', duration: 45 },
    { id: '2', title: 'Review PRs', duration: 20 },
    { id: '3', title: 'Design Sync', duration: 30 },
  ];

  const handleTaskPress = useCallback((task) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setActiveTask(task);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Soft Glows */}
      <View style={[styles.bgGlow, styles.glowMint]} />
      <View style={[styles.bgGlow, styles.glowLavender]} />

      <Header />

      <View style={styles.content}>
        <ZenithTimer
          activeTask={activeTask}
          isRunning={isRunning}
          toggleTimer={toggleTimer}
        />

        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>Floating Intentions</Text>
          <View style={styles.cloudRow}>
            {tasks.map((task, index) => (
              <TaskCloud
                key={task.id}
                task={task}
                isActive={activeTask?.id === task.id}
                onPress={() => handleTaskPress(task)}
                delay={index * 500}
              />
            ))}
          </View>
        </View>
      </View>

      <HorizonNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bgGlow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.4,
    ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } : { shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 100, elevation: 10 }),
  },
  glowMint: {
    backgroundColor: COLORS.mint,
    top: -100,
    left: -100,
  },
  glowLavender: {
    backgroundColor: COLORS.lavender,
    bottom: 100,
    right: -150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'android' ? 40 : 24,
    paddingBottom: 16,
    zIndex: 10,
  },
  timeText: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    fontWeight: '300',
    color: COLORS.textMain,
    letterSpacing: 0.5,
  },
  clarityBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clarityText: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  zenithContainer: {
    height: 300,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  zenithOrb: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: COLORS.mint,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 10,
  },
  zenithInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  zenithTaskTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 8,
  },
  zenithStatus: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  tasksContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 24,
    marginLeft: 8,
  },
  cloudRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  taskCloud: {
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    minWidth: '40%',
  },
  taskCloudActive: {
    borderColor: COLORS.lavender,
    backgroundColor: '#FFFFFF',
    shadowColor: COLORS.lavender,
    shadowOpacity: 0.5,
  },
  taskText: {
    fontSize: 16,
    color: COLORS.textMain,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  navBar: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: width * 0.7,
    height: 64,
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(229,231,235, 0.5)',
    overflow: 'hidden',
  },
  navItem: {
    padding: 12,
  },
});
