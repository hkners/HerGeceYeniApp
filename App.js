import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const DUMMY_HABITS = [
  { id: '1', title: 'Morning Meditation', completed: false },
  { id: '2', title: 'Matcha Latte', completed: false },
  { id: '3', title: 'Pilates Flow', completed: false },
  { id: '4', title: 'Skincare Routine', completed: false },
];

const CustomCheckbox = ({ checked }) => {
  const scale = useSharedValue(checked ? 1 : 1);
  const colorProgress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(checked ? 0.9 : 1, { stiffness: 200 });
    colorProgress.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        colorProgress.value,
        [0, 1],
        ['#FFFFFF', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        colorProgress.value,
        [0, 1],
        ['#E0E0E0', '#FFC0CB']
      )
    };
  });

  return (
    <Animated.View style={[styles.checkbox, animatedStyle]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </Animated.View>
  );
};

const HabitItem = ({ habit, onToggle }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    onToggle(habit.id);
  };

  return (
    <Animated.View style={[styles.habitContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.habitTouchable}
      >
        <Text style={[styles.habitTitle, habit.completed && styles.habitTitleCompleted]}>
          {habit.title}
        </Text>
        <CustomCheckbox checked={habit.completed} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [habits, setHabits] = useState(DUMMY_HABITS);

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.dateText}>TODAY</Text>
          <Text style={styles.greetingText}>Good Morning, Jules</Text>
        </View>
        <View style={styles.listContainer}>
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} onToggle={toggleHabit} />
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
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFDAB9',
    letterSpacing: 2,
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2F4F4F',
  },
  listContainer: {
    gap: 16,
  },
  habitContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  habitTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  habitTitle: {
    fontSize: 18,
    color: '#2F4F4F',
    fontWeight: '400',
  },
  habitTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#A9A9A9',
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
    fontWeight: '600',
  },
});