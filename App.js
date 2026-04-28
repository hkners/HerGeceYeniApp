import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const INITIAL_HABITS = [
  { id: '1', title: 'Morning Skincare Routine', completed: false },
  { id: '2', title: 'Drink 2L Water', completed: false },
  { id: '3', title: 'Read 10 Pages', completed: false },
  { id: '4', title: '15 Min Stretching', completed: false },
];

const CustomCheckbox = React.memo(({ checked, onPress }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });

  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: withTiming(checked ? '#FFDAB9' : '#FFFFFF', { duration: 200 }),
      borderColor: withTiming(checked ? '#FFDAB9' : '#E0E0E0', { duration: 200 }),
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(checked ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withTiming(checked ? 1 : 0.5, { duration: 200 }) }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={styles.checkboxWrapper}
    >
      <Animated.View style={[styles.checkbox, animatedStyle]}>
        <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

const HabitItem = React.memo(({ habit, onToggle }) => {
  const handleToggle = useCallback(() => {
    onToggle(habit.id);
  }, [habit.id, onToggle]);

  return (
    <View style={styles.habitContainer}>
      <Text style={[styles.habitText, habit.completed && styles.habitTextCompleted]}>
        {habit.title}
      </Text>
      <CustomCheckbox checked={habit.completed} onPress={handleToggle} />
    </View>
  );
});

const AnimatedButton = React.memo(({ title, onPress }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });

  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.saveButton, animatedStyle]}>
        <Text style={styles.saveButtonText}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

export default function App() {
  const [habits, setHabits] = useState(INITIAL_HABITS);

  const toggleHabit = useCallback((id) => {
    setHabits((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>Tuesday, Oct 24</Text>
          <Text style={styles.title}>Daily Flow</Text>
          <Text style={styles.subtitle}>Gentle reminders for a mindful day.</Text>
        </View>

        <View style={styles.listContainer}>
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} onToggle={toggleHabit} />
          ))}
        </View>

        <AnimatedButton title="Reflect & Save" />
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
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFC0CB',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#708090',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
    marginBottom: 40,
  },
  habitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  habitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F4F4F',
    letterSpacing: 0.3,
  },
  habitTextCompleted: {
    color: '#A9A9A9',
    textDecorationLine: 'line-through',
  },
  checkboxWrapper: {
    padding: 4,
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
  saveButton: {
    backgroundColor: '#FFDAB9',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F4F4F',
    letterSpacing: 0.5,
  },
});