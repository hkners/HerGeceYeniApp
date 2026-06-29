import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const HABITS = [
  { id: '1', title: 'Morning Meditation', subtitle: '10 minutes' },
  { id: '2', title: 'Matcha Latte', subtitle: 'Mindful preparation' },
  { id: '3', title: 'Journaling', subtitle: '3 pages of thoughts' },
  { id: '4', title: 'Pilates Flow', subtitle: 'Strengthen & stretch' },
];

const HabitCard = ({ habit, onToggle }) => {
  const [completed, setCompleted] = useState(false);
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const toggleHabit = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    progress.value = withTiming(newCompleted ? 1 : 0, { duration: 300 });
    if (onToggle) {
      onToggle(newCompleted ? 1 : -1);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB']
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#EAEAEA', '#FFC0CB']
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
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={toggleHabit}
        style={styles.cardPressable}
      >
        <View style={styles.cardContent}>
          <Text style={[styles.habitTitle, completed && styles.habitTitleCompleted]}>
            {habit.title}
          </Text>
          <Text style={styles.habitSubtitle}>{habit.subtitle}</Text>
        </View>
        <Animated.View style={[styles.checkbox, checkboxStyle]}>
          <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function App() {
  const [completedCount, setCompletedCount] = useState(0);
  const totalCount = HABITS.length;

  const progressWidth = useSharedValue(0);

  const handleToggle = (change) => {
    const newCount = completedCount + change;
    setCompletedCount(newCount);
    progressWidth.value = withTiming((newCount / totalCount) * 100, { duration: 500 });
  };

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.date}>Wednesday, October 11</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Your Daily Glow</Text>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
          </View>
        </View>

        <View style={styles.listContainer}>
          {HABITS.map(habit => (
            <HabitCard key={habit.id} habit={habit} onToggle={handleToggle} />
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
  greeting: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333333',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
  },
  progressContainer: {
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
    elevation: 2,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFDAB9',
    borderRadius: 4,
  },
  listContainer: {
    gap: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  cardPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    paddingRight: 16,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4A4A4A',
    marginBottom: 4,
  },
  habitTitleCompleted: {
    color: '#A0A0A0',
  },
  habitSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
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
    fontSize: 14,
    fontWeight: 'bold',
  },
});