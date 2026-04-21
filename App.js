import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor
} from 'react-native-reanimated';

const DUMMY_TASKS = [
  { id: '1', title: 'Morning mindfulness', time: '08:00 AM', completed: false },
  { id: '2', title: 'Matcha & journaling', time: '08:30 AM', completed: false },
  { id: '3', title: 'Deep work block', time: '09:30 AM', completed: false },
  { id: '4', title: 'Pilates flow', time: '12:00 PM', completed: false },
];

const TaskItem = ({ task, onToggle }) => {
  const isChecked = useSharedValue(task.completed ? 1 : 0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        isChecked.value,
        [0, 1],
        ['#FFFFFF', '#FFDAB9']
      ),
      borderColor: interpolateColor(
        isChecked.value,
        [0, 1],
        ['#EAEAEA', '#FFDAB9']
      ),
      transform: [{ scale: scale.value }]
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        isChecked.value,
        [0, 1],
        ['#333333', '#FFFFFF']
      )
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    const newValue = isChecked.value === 0 ? 1 : 0;
    isChecked.value = withTiming(newValue, { duration: 300 });
    onToggle(task.id);
  };

  return (
    <Animated.View style={[styles.taskContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.touchable}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
      >
        <View style={styles.taskContent}>
          <Animated.Text style={[styles.taskTitle, textStyle]}>
            {task.title}
          </Animated.Text>
          <Animated.Text style={[styles.taskTime, textStyle]}>
            {task.time}
          </Animated.Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Animated.View style={[styles.checkbox, animatedStyle]}>
             {task.completed && <View style={styles.innerDot} />}
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(DUMMY_TASKS);

  const handleToggle = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>Tuesday, Oct 24</Text>
          <Text style={styles.greetingText}>Good morning, Jules.</Text>
        </View>
        <View style={styles.taskList}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC0CB',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 0.5,
  },
  taskList: {
    gap: 16,
  },
  taskContainer: {
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.8,
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  }
});
