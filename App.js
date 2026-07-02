import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const DUMMY_TASKS = [
  { id: '1', title: 'Morning Mindfulness', time: '08:00 AM', completed: false },
  { id: '2', title: 'Hydration Goal', time: '10:30 AM', completed: false },
  { id: '3', title: 'Deep Focus Session', time: '01:00 PM', completed: false },
  { id: '4', title: 'Evening Stretch', time: '07:00 PM', completed: false },
];

const TaskCard = ({ task, onToggle }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(task.completed ? 0.6 : 1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    const nextCompleted = !task.completed;
    opacity.value = withTiming(nextCompleted ? 0.6 : 1, { duration: 300 });
    onToggle(task.id);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[styles.card, animatedStyle, task.completed && styles.cardCompleted]}>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, task.completed && styles.textCompleted]}>{task.title}</Text>
          <Text style={styles.cardTime}>{task.time}</Text>
        </View>
        <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
          {task.completed && <View style={styles.checkboxInner} />}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(DUMMY_TASKS);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.subtitle}>Your gentle reminders for today</Text>
        </View>
        <View style={styles.list}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
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
    padding: 24,
    paddingTop: 60,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#708090',
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFF0F5',
  },
  cardCompleted: {
    shadowOpacity: 0.1,
    borderColor: '#F0F0F0',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#A9A9A9',
  },
  cardTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#708090',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFDAB9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#FFC0CB',
    borderColor: '#FFC0CB',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});