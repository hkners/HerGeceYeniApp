import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_TASKS = [
  { id: '1', title: 'Morning hydration', time: '08:00 AM', completed: false },
  { id: '2', title: 'Review key metrics', time: '09:30 AM', completed: false },
  { id: '3', title: 'Focus block: Design', time: '11:00 AM', completed: false },
  { id: '4', title: 'Mindful walk', time: '02:00 PM', completed: false },
  { id: '5', title: 'Evening reflection', time: '08:00 PM', completed: false },
];

const TaskItem = ({ task, onToggle }) => {
  const isCompleted = task.completed;
  const progress = useSharedValue(isCompleted ? 1 : 0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    progress.value = withTiming(isCompleted ? 1 : 0, { duration: 300 });
  }, [isCompleted, progress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FFDAB9'] // White to Soft Peach
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#F0F0F0', '#FFC0CB'] // Light Gray to Blush Pink
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ['#333333', '#A0A0A0']
    );
    return {
      color,
      textDecorationLine: isCompleted ? 'line-through' : 'none',
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <Pressable
      onPress={() => onToggle(task.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isCompleted }}
      accessibilityLabel={`Task: ${task.title}, at ${task.time}`}
    >
      <Animated.View style={[styles.taskContainer, animatedContainerStyle]}>
        <View style={styles.taskContent}>
          <Animated.Text style={[styles.taskTitle, animatedTextStyle]}>
            {task.title}
          </Animated.Text>
          <Text style={styles.taskTime}>{task.time}</Text>
        </View>
        <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
          {isCompleted && <View style={styles.checkboxInner} />}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressText = `${completedCount} of ${totalCount} completed`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>Today</Text>
          <Text style={styles.title}>Daily Flow</Text>
          <Text style={styles.subtitle}>{progressText}</Text>
        </View>

        <View style={styles.listContainer}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} />
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
    paddingTop: 80,
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
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
  },
  listContainer: {
    gap: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
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
    color: '#888888',
    fontWeight: '400',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  checkboxCompleted: {
    borderColor: '#FFC0CB',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFC0CB',
  },
});
