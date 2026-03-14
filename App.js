import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { CheckCircle2, Circle, Wind, Sun, Moon, Zap, Coffee, Activity } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const TASKS = [
  { id: '1', title: 'Deep Work Session', category: 'Deep', duration: '90m', energy: 'high', completed: false },
  { id: '2', title: 'Reply to Emails', category: 'Crisp', duration: '30m', energy: 'low', completed: false },
  { id: '3', title: 'Team Sync', category: 'Mellow', duration: '45m', energy: 'medium', completed: false },
  { id: '4', title: 'Brainstorm Concept', category: 'Deep', duration: '60m', energy: 'high', completed: false },
  { id: '5', title: 'Review Metrics', category: 'Crisp', duration: '20m', energy: 'low', completed: true },
];

const VIBES = [
  { id: 'Crisp', icon: Wind, color: '#A0D8E6', bg: 'rgba(160, 216, 230, 0.2)' },
  { id: 'Mellow', icon: Coffee, color: '#FFDAB9', bg: 'rgba(255, 218, 185, 0.2)' },
  { id: 'Deep', icon: Zap, color: '#FFC0CB', bg: 'rgba(255, 192, 203, 0.2)' },
];

const TaskCard = ({ task, onPress, focused }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(task.completed ? 0.6 : 1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(task);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getPriorityColor = () => {
    if (task.energy === 'high') return 'rgba(255, 192, 203, 0.3)'; // Soft Blush
    if (task.energy === 'medium') return 'rgba(255, 218, 185, 0.3)'; // Soft Peach
    return 'rgba(160, 216, 230, 0.3)'; // Soft Sky
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      {/* Glow Orb behind the card */}
      <View style={[styles.glowOrb, { backgroundColor: getPriorityColor() }]} />

      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.cardTouch}
      >
        <BlurView intensity={20} tint="light" style={styles.cardBlur}>
          <View style={styles.cardContent}>
            <View style={styles.taskLeft}>
              <TouchableOpacity onPress={handlePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                {task.completed ? (
                  <CheckCircle2 color="#888888" size={24} strokeWidth={1.5} />
                ) : (
                  <Circle color="#4A4A4A" size={24} strokeWidth={1.5} />
                )}
              </TouchableOpacity>
              <View style={styles.taskTextContainer}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                  {task.title}
                </Text>
                <Text style={styles.taskMeta}>
                  {task.category} • {task.duration}
                </Text>
              </View>
            </View>
            <View style={[styles.energyIndicator, { backgroundColor: getPriorityColor() }]} />
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(TASKS);
  const [activeVibe, setActiveVibe] = useState('All');
  const [focusMode, setFocusMode] = useState(null); // task id if in focus

  // Animations
  const focusProgress = useSharedValue(0); // 0 = normal, 1 = focus
  const fadeAnim = useSharedValue(0); // initial load fade

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
  }, []);

  const toggleTask = (toggledTask) => {
    if (focusMode && focusMode !== toggledTask.id) return;

    if (focusMode === toggledTask.id) {
      // Complete focused task
      setTasks(tasks.map(t => t.id === toggledTask.id ? { ...t, completed: true } : t));
      setFocusMode(null);
      focusProgress.value = withTiming(0, { duration: 600 });
      return;
    }

    if (!toggledTask.completed) {
      // Enter focus mode
      setFocusMode(toggledTask.id);
      focusProgress.value = withTiming(1, { duration: 600 });
    } else {
      // Un-complete
      setTasks(tasks.map(t => t.id === toggledTask.id ? { ...t, completed: false } : t));
    }
  };

  const filteredTasks = tasks.filter(t => activeVibe === 'All' || t.category === activeVibe);
  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed); // show all completed at bottom

  const mainUiStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 1], [1, 0]),
    transform: [{ scale: interpolate(focusProgress.value, [0, 1], [1, 0.95]) }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      ['#FAFAFA', '#E8F4F8'] // From pure snow to soft breathable mint/blue
    ),
  }));

  const initialFadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: interpolate(fadeAnim.value, [0, 1], [10, 0]) }],
  }));

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <StatusBar style="dark" />

      {/* Main Dashboard (Fades out in Focus Mode) */}
      <Animated.View style={[styles.mainDashboard, mainUiStyle]} pointerEvents={focusMode ? 'none' : 'auto'}>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View style={[styles.header, initialFadeStyle]}>
            <View>
              <Text style={styles.dateText}>Today, Oct 24</Text>
              <Text style={styles.title}>Lumina</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Sun color="#4A4A4A" size={24} strokeWidth={1.5} />
            </TouchableOpacity>
          </Animated.View>

          {/* Vibe Selector */}
          <Animated.View style={[styles.vibeSelector, initialFadeStyle]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vibeScroll}>
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setActiveVibe('All');
                }}
                style={[styles.vibePill, activeVibe === 'All' && styles.vibePillActive]}
              >
                <Activity size={16} color={activeVibe === 'All' ? '#333' : '#888'} style={{ marginRight: 6 }} />
                <Text style={[styles.vibeText, activeVibe === 'All' && styles.vibeTextActive]}>Flow</Text>
              </TouchableOpacity>
              {VIBES.map(vibe => {
                const Icon = vibe.icon;
                const isActive = activeVibe === vibe.id;
                return (
                  <TouchableOpacity
                    key={vibe.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setActiveVibe(vibe.id);
                    }}
                    style={[
                      styles.vibePill,
                      isActive && { backgroundColor: vibe.bg, borderColor: vibe.color },
                    ]}
                  >
                    <Icon size={16} color={isActive ? '#333' : '#888'} style={{ marginRight: 6 }} />
                    <Text style={[styles.vibeText, isActive && styles.vibeTextActive]}>{vibe.id}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>

          <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            <Animated.View style={initialFadeStyle}>
              {activeTasks.map(task => (
                <TaskCard key={task.id} task={task} onPress={toggleTask} />
              ))}

              {completedTasks.length > 0 && (
                <View style={styles.ghostArchive}>
                  <Text style={styles.archiveTitle}>Drifting</Text>
                  {completedTasks.map(task => (
                    <TaskCard key={task.id} task={task} onPress={toggleTask} />
                  ))}
                </View>
              )}
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {/* Focus Mode Overlay */}
      {focusMode && (
        <Animated.View
          style={[
            styles.focusOverlay,
            { opacity: focusProgress }
          ]}
          pointerEvents="box-none"
        >
          <SafeAreaView style={styles.focusSafeArea}>
            <View style={styles.focusContent}>
              <Text style={styles.focusApertureText}>Focus Aperture</Text>
              <View style={styles.focusedCardContainer}>
                {tasks.filter(t => t.id === focusMode).map(task => (
                  <TaskCard key={task.id} task={task} onPress={toggleTask} focused />
                ))}
              </View>
              <Text style={styles.focusInstruction}>Tap circle to complete and exit</Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}

      {/* Floating Bottom Nav (Fades out in Focus Mode) */}
      <Animated.View style={[styles.bottomNav, mainUiStyle]} pointerEvents={focusMode ? 'none' : 'auto'}>
        <BlurView intensity={30} tint="light" style={styles.navBlur}>
          <View style={styles.navContent}>
            <TouchableOpacity style={styles.navItem}>
              <Moon color="#4A4A4A" size={24} strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemActive}>
              <View style={styles.navHalo} />
              <Sun color="#333" size={24} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Activity color="#4A4A4A" size={24} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  mainDashboard: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  dateText: {
    fontSize: 14,
    color: '#888888',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '400',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: -0.5,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  vibeSelector: {
    marginBottom: 20,
  },
  vibeScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  vibePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  vibePillActive: {
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  vibeText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#888888',
  },
  vibeTextActive: {
    color: '#333333',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // space for bottom nav
    gap: 16,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 16,
  },
  glowOrb: {
    position: 'absolute',
    top: -10,
    left: 20,
    right: 20,
    bottom: -10,
    borderRadius: 40,
    filter: 'blur(15px)', // Approximation for web/some native, actual glow relies on color
    opacity: 0.8,
  },
  cardTouch: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardBlur: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#4A4A4A',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  taskTitleCompleted: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '400',
  },
  energyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  ghostArchive: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 24,
  },
  archiveTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A0A0A0',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: width * 0.6,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  navBlur: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: {
    padding: 10,
  },
  navItemActive: {
    padding: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHalo: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 218, 185, 0.4)', // Soft peach glow
  },
  focusOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  focusSafeArea: {
    flex: 1,
    width: '100%',
  },
  focusContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  focusApertureText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#888888',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 40,
  },
  focusedCardContainer: {
    width: '100%',
    transform: [{ scale: 1.05 }],
  },
  focusInstruction: {
    marginTop: 40,
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '400',
  },
});
