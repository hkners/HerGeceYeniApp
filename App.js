import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

// --- Data ---
const INITIAL_HABITS = [
  { id: '1', title: 'Morning Meditation', subtitle: '10 minutes of mindfulness', time: '07:00 AM', completed: false, highlight: true },
  { id: '2', title: 'Hydration Goal', subtitle: 'Drink 2L of water', time: 'All Day', completed: false, highlight: false },
  { id: '3', title: 'Deep Work Session', subtitle: 'Focus without distractions', time: '10:00 AM', completed: false, highlight: true },
  { id: '4', title: 'Evening Stretch', subtitle: 'Release tension', time: '09:00 PM', completed: false, highlight: false },
];

// --- Custom Checkbox Component ---
const CustomCheckbox = ({ isChecked }) => {
  const checkScale = useSharedValue(isChecked ? 1 : 0);
  const bgProgress = useSharedValue(isChecked ? 1 : 0);

  React.useEffect(() => {
    checkScale.value = withSpring(isChecked ? 1 : 0, { mass: 0.5, damping: 12 });
    bgProgress.value = withTiming(isChecked ? 1 : 0, { duration: 200 });
  }, [isChecked]);

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgProgress.value,
      [0, 1],
      ['transparent', '#FFDAB9'] // Soft peach when checked
    );
    const borderColor = interpolateColor(
      bgProgress.value,
      [0, 1],
      ['#E0E0E0', '#FFDAB9']
    );
    return { backgroundColor, borderColor };
  });

  return (
    <Animated.View style={[styles.checkboxContainer, animatedContainerStyle]}>
      <Animated.Text style={[styles.checkmark, animatedCheckStyle]}>✓</Animated.Text>
    </Animated.View>
  );
};

// --- Habit Card Component ---
const HabitCard = ({ habit, onToggle }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const breathScale = useSharedValue(1);

  React.useEffect(() => {
    if (habit.highlight && !habit.completed) {
      breathScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    } else {
      breathScale.value = withTiming(1);
    }
  }, [habit.highlight, habit.completed]);

  React.useEffect(() => {
    opacity.value = withTiming(habit.completed ? 0.6 : 1, { duration: 300 });
  }, [habit.completed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * breathScale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => { scale.value = withSpring(0.97); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onToggle(habit.id)}
        style={[
          styles.cardInner,
          habit.completed && styles.cardCompleted,
          habit.highlight && !habit.completed && styles.cardHighlight
        ]}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.habitTime, habit.completed && styles.textCompleted]}>{habit.time}</Text>
          <Text style={[styles.habitTitle, habit.completed && styles.textCompleted]}>{habit.title}</Text>
          <Text style={[styles.habitSubtitle, habit.completed && styles.textCompleted]}>{habit.subtitle}</Text>
        </View>
        <CustomCheckbox isChecked={habit.completed} />
      </Pressable>
    </Animated.View>
  );
};

// --- Main App Component ---
export default function App() {
  const [habits, setHabits] = useState(INITIAL_HABITS);

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progressText = completedCount === habits.length ? "All done!" : `${completedCount} of ${habits.length} completed`;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <Text style={styles.dateText}>TODAY</Text>
            <Text style={styles.greeting}>Good Morning.</Text>
            <Text style={styles.progressText}>{progressText}</Text>
          </View>

          <View style={styles.listContainer}>
            {habits.map(habit => (
              <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} />
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// --- Styles ("Clean Girl" Aesthetic) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Ultra-light off-white
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFC0CB', // Blush pink accent
    letterSpacing: 2,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '300', // Light font weight for airy feel
    color: '#2F4F4F', // Dark slate gray (no harsh black)
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#8A9A9A', // Lighter slate for secondary text
    fontWeight: '400',
  },
  listContainer: {
    gap: 16, // Spacious gaps
  },
  cardWrapper: {
    width: '100%',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // Pure white cards
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24, // Soft, rounded corners
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Soft, airy shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#F7F7F7',
    borderColor: '#EFEFEF',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardHighlight: {
    borderColor: '#FFDAB9', // Soft peach border for highlighted items
    shadowColor: '#FFDAB9',
    shadowOpacity: 0.15,
  },
  cardContent: {
    flex: 1,
    paddingRight: 16,
  },
  habitTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A0AAB2',
    marginBottom: 4,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  habitSubtitle: {
    fontSize: 14,
    color: '#8A9A9A',
    fontWeight: '300',
  },
  textCompleted: {
    color: '#B0B0B0', // Faded text when completed
    textDecorationLine: 'line-through',
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14, // Perfectly circular
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
