import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const DUMMY_TASKS = [
  { id: '1', title: 'Morning Meditation', description: '10 minutes of mindfulness' },
  { id: '2', title: 'Hydrate', description: 'Drink 500ml of water with lemon' },
  { id: '3', title: 'Skincare Routine', description: 'Cleanse, tone, and moisturize' },
  { id: '4', title: 'Journaling', description: 'Write down 3 things you are grateful for' },
];

const TaskItem = ({ task }) => {
  const [completed, setCompleted] = useState(false);
  const scale = useSharedValue(1);
  const checkProgress = useSharedValue(0);

  const toggleTask = () => {
    const nextState = !completed;
    setCompleted(nextState);
    checkProgress.value = withTiming(nextState ? 1 : 0, { duration: 300 });
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checkProgress.value,
      [0, 1],
      ['#FFFFFF', '#FFDAB9'] // White to Soft Peach
    );
    const borderColor = interpolateColor(
      checkProgress.value,
      [0, 1],
      ['#E0E0E0', '#FFDAB9']
    );
    return {
      backgroundColor,
      borderColor,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: checkProgress.value,
      transform: [{ scale: checkProgress.value }],
    };
  });

  return (
    <Pressable
      onPress={toggleTask}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.taskCard, animatedStyle]}>
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskTitle, completed && styles.taskTitleCompleted]}>
            {task.title}
          </Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>
        <Animated.View style={[styles.checkbox, checkboxStyle]}>
          <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.dateText}>Tuesday, Oct 24</Text>
          <Text style={styles.greetingText}>Good Morning, Bella</Text>
        </View>

        <View style={styles.taskList}>
          {DUMMY_TASKS.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Ultra-light off-white
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  dateText: {
    fontSize: 14,
    color: '#FFC0CB', // Blush pink
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 28,
    color: '#2F4F4F', // Dark slate gray
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  taskList: {
    gap: 16,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Pure white
    padding: 20,
    borderRadius: 20, // Soft rounded corners
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
  },
  taskTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  taskTitle: {
    fontSize: 18,
    color: '#2F4F4F',
    fontWeight: '500',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#A9A9A9',
  },
  taskDescription: {
    fontSize: 14,
    color: '#808080',
    fontWeight: '400',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});