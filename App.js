import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const INITIAL_HABITS = [
  { id: '1', title: 'Morning Meditation', subtitle: '10 minutes of mindfulness', completed: false },
  { id: '2', title: 'Hydration', subtitle: 'Drink 2L of water today', completed: false },
  { id: '3', title: 'Journaling', subtitle: 'Write down 3 grateful things', completed: false },
  { id: '4', title: 'Reading', subtitle: 'Read 20 pages of a book', completed: false },
];

const CustomCheckbox = ({ checked }) => {
  const checkAnim = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    checkAnim.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked, checkAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checkAnim.value,
      [0, 1],
      ['transparent', '#FFC0CB']
    );
    const borderColor = interpolateColor(
      checkAnim.value,
      [0, 1],
      ['#E0E0E0', '#FFC0CB']
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const checkMarkStyle = useAnimatedStyle(() => {
    return {
      opacity: checkAnim.value,
      transform: [{ scale: checkAnim.value }],
    };
  });

  return (
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      <Animated.View style={[styles.checkMark, checkMarkStyle]} />
    </Animated.View>
  );
};

const HabitItem = ({ habit, onToggle }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.habitCard, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onToggle(habit.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: habit.completed }}
        style={styles.pressableArea}
      >
        <View style={styles.habitTextContainer}>
          <Text style={[styles.habitTitle, habit.completed && styles.habitTitleCompleted]}>
            {habit.title}
          </Text>
          <Text style={styles.habitSubtitle}>{habit.subtitle}</Text>
        </View>
        <CustomCheckbox checked={habit.completed} />
      </Pressable>
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>Today</Text>
          <Text style={styles.title}>Lumina Daily</Text>
          <Text style={styles.subtitle}>Breathe in, breathe out. Cultivate your peace.</Text>
        </View>

        <View style={styles.listContainer}>
          {habits.map(habit => (
            <HabitItem
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
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFDAB9',
    textTransform: 'uppercase',
    letterSpacing: 2,
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
    color: '#7C8C8C',
    lineHeight: 22,
  },
  listContainer: {
    gap: 16,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  pressableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  habitTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  habitTitleCompleted: {
    color: '#B0B8B8',
    textDecorationLine: 'line-through',
  },
  habitSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8A9A9A',
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});
