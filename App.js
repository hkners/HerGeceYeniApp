import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const INITIAL_ROUTINES = [
  { id: '1', title: 'Morning Matcha & Journaling', time: '08:00 AM', completed: false },
  { id: '2', title: 'Pilates Flow', time: '09:30 AM', completed: false },
  { id: '3', title: 'Hydration Break', time: '12:00 PM', completed: false },
  { id: '4', title: 'Skincare Routine', time: '09:00 PM', completed: false },
];

const RoutineItem = ({ routine, onToggle }) => {
  const scale = useSharedValue(1);
  const completedProgress = useSharedValue(routine.completed ? 1 : 0);

  const onPressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const onPress = () => {
    const nextCompleted = !routine.completed;
    onToggle(routine.id);
    completedProgress.value = withTiming(nextCompleted ? 1 : 0, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        completedProgress.value,
        [0, 1],
        ['#FFFFFF', '#FAFAFA']
      ),
      borderColor: interpolateColor(
        completedProgress.value,
        [0, 1],
        ['#FFDAB9', '#EAEAEA']
      ),
      opacity: interpolateColor(completedProgress.value, [0, 1], [1, 0.7]),
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        completedProgress.value,
        [0, 1],
        ['transparent', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        completedProgress.value,
        [0, 1],
        ['#FFDAB9', '#FFC0CB']
      ),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        completedProgress.value,
        [0, 1],
        ['#2F4F4F', '#A9A9A9']
      ),
    };
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: routine.completed }}
      accessibilityLabel={`Routine: ${routine.title}, Time: ${routine.time}`}
    >
      <Animated.View style={[styles.routineContainer, animatedStyle]}>
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.routineTitle, textStyle]}>
            {routine.title}
          </Animated.Text>
          <Text style={styles.routineTime}>{routine.time}</Text>
        </View>
        <Animated.View style={[styles.checkbox, checkmarkStyle]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default function App() {
  const [routines, setRoutines] = useState(INITIAL_ROUTINES);

  const toggleRoutine = (id) => {
    setRoutines(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = routines.filter(r => r.completed).length;
  const progressPercent = Math.round((completedCount / routines.length) * 100) || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.subtitle}>Your daily flow awaits.</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{progressPercent}% Complete</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {routines.map(routine => (
            <RoutineItem
              key={routine.id}
              routine={routine}
              onToggle={toggleRoutine}
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
    marginTop: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#708090',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFDAB9',
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC0CB',
  },
  listContainer: {
    gap: 16,
  },
  routineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  textContainer: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  routineTime: {
    fontSize: 14,
    color: '#A9A9A9',
    fontWeight: '400',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginLeft: 16,
  },
});