import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_HABITS = [
  { id: '1', title: 'Morning Meditation', completed: false, time: '8:00 AM' },
  { id: '2', title: 'Read 20 Pages', completed: false, time: '12:00 PM' },
  { id: '3', title: 'Pilates Flow', completed: false, time: '5:30 PM' },
  { id: '4', title: 'Skincare Routine', completed: false, time: '9:00 PM' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HabitItem = ({ habit, onToggle }) => {
  const isCompleted = habit.completed;
  const progress = useSharedValue(isCompleted ? 1 : 0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    progress.value = withTiming(isCompleted ? 1 : 0, { duration: 300 });
  }, [isCompleted]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#F0F0F0', '#EAEAEA']
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ['#4A4A4A', '#A0A0A0']
    );

    return {
      color,
    };
  });

  const animatedCheckStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FAFAFA', '#FFDAB9']
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#EAEAEA', '#FFDAB9']
    );
    return {
      backgroundColor,
      borderColor,
    };
  });

  const animatedCheckIconStyle = useAnimatedStyle(() => {
     return {
         opacity: progress.value,
         transform: [{ scale: progress.value }]
     }
  });

  const onPressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={() => onToggle(habit.id)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.habitContainer, animatedContainerStyle]}
    >
      <View style={styles.habitContent}>
        <Animated.Text style={[styles.habitTitle, animatedTextStyle]}>
          {habit.title}
        </Animated.Text>
        <Text style={styles.habitTime}>{habit.time}</Text>
      </View>
      <Animated.View style={[styles.customCheckbox, animatedCheckStyle]}>
          <Animated.View style={[styles.checkMark, animatedCheckIconStyle]} />
      </Animated.View>
    </AnimatedPressable>
  );
};

export default function App() {
  const [habits, setHabits] = useState(INITIAL_HABITS);

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.subtitle}>Let's focus on your daily habits.</Text>
          <View style={styles.progressContainer}>
             <Text style={styles.progressText}>{completedCount} of {habits.length} completed</Text>
          </View>
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
    backgroundColor: '#FFFFFF',
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
  greeting: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2C2C2C',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#A0A0A0',
    letterSpacing: 0.2,
    marginBottom: 20
  },
  progressContainer: {
      backgroundColor: '#FAFAFA',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignSelf: 'flex-start'
  },
  progressText: {
      color: '#FFC0CB',
      fontWeight: '600',
      fontSize: 14
  },
  listContainer: {
    gap: 16,
  },
  habitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  habitTime: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '400',
  },
  customCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
     width: 12,
     height: 12,
     borderRadius: 6,
     backgroundColor: '#FFFFFF'
  }
});