import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const INITIAL_HABITS = [
  { id: '1', title: 'Morning Meditation', completed: false },
  { id: '2', title: 'Drink 2L Water', completed: false },
  { id: '3', title: 'Read 10 Pages', completed: false },
  { id: '4', title: 'Journaling', completed: false },
];

const HabitCard = ({ habit, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(habit.completed ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    checked.value = withTiming(habit.completed ? 0 : 1, { duration: 300 });
    onToggle(habit.id);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  const checkboxAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checked.value,
      [0, 1],
      ['#FFFFFF', '#FFDAB9']
    );
    const borderColor = interpolateColor(
      checked.value,
      [0, 1],
      ['#FFC0CB', '#FFDAB9']
    );
    return {
      backgroundColor,
      borderColor,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      checked.value,
      [0, 1],
      ['darkslategray', '#FFC0CB']
    );
    return { color };
  });

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.card, animatedStyle]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: habit.completed }}
      accessibilityLabel={habit.title}
    >
      <View style={styles.cardContent}>
        <Animated.View style={[styles.checkbox, checkboxAnimatedStyle]} />
        <Animated.Text style={[styles.habitTitle, textAnimatedStyle]}>
          {habit.title}
        </Animated.Text>
      </View>
    </AnimatedPressable>
  );
};

export default function App() {
  const [habits, setHabits] = useState(INITIAL_HABITS);

  const toggleHabit = (id) => {
    setHabits(prev =>
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
          <Text style={styles.title}>Daily Flow</Text>
          <Text style={styles.subtitle}>Breathe into your daily intentions.</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: 'darkslategray',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'darkslategray',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
