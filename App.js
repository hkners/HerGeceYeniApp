import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const DUMMY_TASKS = [
  { id: '1', title: 'Morning Matcha & Journaling', completed: false },
  { id: '2', title: 'Pilates or Light Stretching', completed: false },
  { id: '3', title: 'Deep Work Session', completed: false },
  { id: '4', title: 'Evening Skincare Routine', completed: false },
];

const TaskItem = ({ task, onToggle }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(task.completed ? 0.6 : 1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    onToggle(task.id);
  };

  React.useEffect(() => {
    opacity.value = withTiming(task.completed ? 0.6 : 1, { duration: 300 });
  }, [task.completed, opacity]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ checked: task.completed }}
    >
      <Animated.View style={[styles.taskContainer, animatedStyle]}>
        <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
          {task.completed && <View style={styles.checkboxInner} />}
        </View>
        <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
          {task.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(DUMMY_TASKS);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>Today, Oct 24</Text>
          <Text style={styles.title}>Daily Intentions</Text>
        </View>
        <View style={styles.list}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFB6C1', // blush pink
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333333', // dark slate gray
    letterSpacing: 1,
  },
  list: {
    gap: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20, // soft rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12, // completely round
    borderWidth: 1.5,
    borderColor: '#FFDAB9', // soft peach
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#FFDAB9',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  taskText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
    flex: 1,
  },
  taskTextCompleted: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
});