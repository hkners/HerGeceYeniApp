import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_TASKS = [
  { id: '1', title: 'Morning Skincare Routine', time: '08:00 AM', completed: false },
  { id: '2', title: 'Matcha Latte & Journaling', time: '08:30 AM', completed: false },
  { id: '3', title: 'Pilates Flow', time: '09:00 AM', completed: false },
  { id: '4', title: 'Read 10 Pages', time: '08:00 PM', completed: false },
];

const TaskItem = ({ task, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(task.completed ? 1 : 0);

  useEffect(() => {
    checked.value = withTiming(task.completed ? 1 : 0, { duration: 300 });
  }, [task.completed]);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    onToggle(task.id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
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
      backgroundColor,
      borderColor,
    };
  });

  const checkmarkOpacity = useAnimatedStyle(() => ({
    opacity: checked.value,
  }));

  const textOpacity = useAnimatedStyle(() => ({
    opacity: 1 - (checked.value * 0.6),
  }));

  return (
    <Animated.View style={[styles.taskContainer, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        style={styles.pressableArea}
      >
        <Animated.View style={[styles.checkbox, checkboxStyle]}>
          <Animated.Text style={[styles.checkmark, checkmarkOpacity]}>✓</Animated.Text>
        </Animated.View>
        <View style={styles.taskTextContainer}>
          <Animated.Text style={[styles.taskTitle, textOpacity, { textDecorationLine: task.completed ? 'line-through' : 'none' }]}>
            {task.title}
          </Animated.Text>
          <Text style={styles.taskTime}>{task.time}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>Tuesday, 24th</Text>
          <Text style={styles.title}>Daily Flow</Text>
          <Text style={styles.subtitle}>Curating a beautiful day, one habit at a time.</Text>
        </View>

        <View style={styles.listContainer}>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFDAB9',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: '#2F4F4F',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#708090',
    lineHeight: 24,
  },
  listContainer: {
    gap: 16,
  },
  taskContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 218, 185, 0.2)',
  },
  pressableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: '#A9A9A9',
    fontWeight: '400',
  },
});