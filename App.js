import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_HABITS = [
  { id: '1', title: 'Morning Matcha', completed: false, time: '8:00 AM' },
  { id: '2', title: 'Pilates Flow', completed: false, time: '10:00 AM' },
  { id: '3', title: 'Mindful Journaling', completed: false, time: '1:00 PM' },
  { id: '4', title: 'Deep Work Block', completed: false, time: '2:00 PM' },
  { id: '5', title: 'Evening Skincare', completed: false, time: '9:00 PM' },
];

const CustomCheckbox = ({ checked }) => {
  const progress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB'] // from white to blush pink
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#E0E0E0', '#FFC0CB']
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }],
    };
  });

  return (
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
    </Animated.View>
  );
};

const HabitCard = ({ habit, onToggle }) => {
  const scale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={animatedCardStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onToggle(habit.id)}
        style={[styles.card, habit.completed && styles.cardCompleted]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: habit.completed }}
        accessibilityLabel={`Toggle habit ${habit.title}`}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.habitTitle, habit.completed && styles.habitTitleCompleted]}>
            {habit.title}
          </Text>
          <Text style={styles.habitTime}>{habit.time}</Text>
        </View>
        <CustomCheckbox checked={habit.completed} />
      </TouchableOpacity>
    </Animated.View>
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

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.subtitle}>Let the UI breathe.</Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{progressPercent}% flowing</Text>
          </View>
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
    backgroundColor: '#FAFAFA', // ultra-light off-white
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 48,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '300',
    color: '#333333', // slate gray
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
    marginBottom: 24,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  progressText: {
    color: '#FFC0CB', // blush pink
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  cardCompleted: {
    backgroundColor: '#FDFDFD',
    shadowOpacity: 0.01,
  },
  cardContent: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 6,
  },
  habitTitleCompleted: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
  habitTime: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '400',
  },
  checkboxContainer: {
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
