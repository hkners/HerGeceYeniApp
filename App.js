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

const INITIAL_TASKS = [
  { id: '1', title: 'Morning pages & coffee', time: '08:00 AM', completed: false },
  { id: '2', title: 'Pilates flow', time: '10:30 AM', completed: false },
  { id: '3', title: 'Deep focus block', time: '01:00 PM', completed: false },
  { id: '4', title: 'Skincare routine', time: '09:00 PM', completed: false },
];

const TaskCard = ({ task, onToggle }) => {
  const scale = useSharedValue(1);
  const isCompleted = useSharedValue(task.completed ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    onToggle(task.id);
    isCompleted.value = withTiming(task.completed ? 0 : 1, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: isCompleted.value === 1 ? 0.6 : 1,
    };
  });

  const checkboxAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        isCompleted.value,
        [0, 1],
        ['#FFFFFF', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        isCompleted.value,
        [0, 1],
        ['#E0E0E0', '#FFC0CB']
      ),
    };
  });

  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isCompleted.value,
      transform: [{ scale: isCompleted.value }],
    };
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardContent}>
          <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
            {task.title}
          </Text>
          <Text style={styles.taskTime}>{task.time}</Text>
        </View>
        <Animated.View style={[styles.checkbox, checkboxAnimatedStyle]}>
          <Animated.View style={[styles.checkmark, checkmarkAnimatedStyle]} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.date}>Sunday, Oct 15</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Flow</Text>
          <View style={styles.listContainer}>
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </View>
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
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: '#333333',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFDAB9',
    letterSpacing: 1,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  cardContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0',
  },
  taskTime: {
    fontSize: 13,
    fontWeight: '300',
    color: '#888888',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});