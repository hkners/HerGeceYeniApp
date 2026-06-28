import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

const DUMMY_TASKS = [
  { id: '1', title: 'Morning Meditation', subtitle: '10 minutes of mindfulness' },
  { id: '2', title: 'Hydration', subtitle: 'Drink 2L of water' },
  { id: '3', title: 'Journaling', subtitle: 'Reflect on yesterday' },
  { id: '4', title: 'Reading', subtitle: 'Read 20 pages' },
];

const TaskCard = ({ task, isCompleted, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(isCompleted ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    const nextState = !isCompleted;
    checked.value = withTiming(nextState ? 1 : 0, { duration: 300 });
    onToggle(task.id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkboxStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      checked.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB']
    );
    const borderColor = interpolateColor(
      checked.value,
      [0, 1],
      ['#EAEAEA', '#FFC0CB']
    );
    return {
      backgroundColor: bgColor,
      borderColor: borderColor,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checked.value,
    transform: [{ scale: checked.value }],
  }));

  const titleStyle = [
    styles.taskTitle,
    { textDecorationLine: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#A0A0A0' : '#2F4F4F' }
  ];

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardContent}>
          <Text style={titleStyle}>{task.title}</Text>
          <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
        </View>
        <Animated.View style={[styles.checkbox, checkboxStyle]}>
          <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [completedTasks, setCompletedTasks] = useState({});

  const toggleTask = (id) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.subtitle}>Your daily calm awaits.</Text>
        </View>

        <View style={styles.tasksContainer}>
          {DUMMY_TASKS.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isCompleted={!!completedTasks[task.id]}
              onToggle={toggleTask}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A9A9A',
    fontWeight: '400',
  },
  tasksContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFF5EE',
  },
  cardContent: {
    flex: 1,
    marginRight: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskSubtitle: {
    fontSize: 14,
    color: '#8A9A9A',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});