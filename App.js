import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, StatusBar } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DUMMY_HABITS = [
  { id: '1', title: 'Morning Matcha & Journal', time: '8:00 AM', completed: false },
  { id: '2', title: 'Pilates Flow', time: '10:30 AM', completed: false },
  { id: '3', title: 'Hydration Goal (2L)', time: 'All Day', completed: false },
  { id: '4', title: 'Evening Skincare Routine', time: '9:00 PM', completed: false },
];

const HabitCard = ({ habit, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(habit.completed ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const checkStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(checked.value ? '#FFC0CB' : '#FAFAFA', { duration: 300 }),
      borderColor: withTiming(checked.value ? '#FFC0CB' : '#E0E0E0', { duration: 300 }),
    };
  });

  const checkMarkStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(checked.value ? 1 : 0, { duration: 300 }),
      transform: [{ scale: withSpring(checked.value ? 1 : 0.5) }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    const newValue = !habit.completed;
    checked.value = newValue ? 1 : 0;
    onToggle(habit.id);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.card, animatedStyle]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: habit.completed }}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={[styles.habitTitle, habit.completed && styles.habitTitleCompleted]}>
            {habit.title}
          </Text>
          <Text style={styles.habitSubtitle}>{habit.time}</Text>
        </View>
        <Animated.View style={[styles.checkbox, checkStyle]}>
          <Animated.Text style={[styles.checkMark, checkMarkStyle]}>✓</Animated.Text>
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
};

export default function App() {
  const [habits, setHabits] = useState(DUMMY_HABITS);

  const toggleHabit = (id) => {
    setHabits(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>Today, Oct 24</Text>
          <Text style={styles.title}>Daily Aura</Text>
        </View>

        <View style={styles.listContainer}>
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFDAB9',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2F4F4F',
    marginBottom: 6,
  },
  habitTitleCompleted: {
    color: '#A9A9A9',
    textDecorationLine: 'line-through',
  },
  habitSubtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#808080',
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});