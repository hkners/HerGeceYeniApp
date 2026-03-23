import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, Platform, UIManager } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const HABITS = [
  { id: '1', title: 'Drink 2L Water', icon: '💧' },
  { id: '2', title: 'Morning Stretch', icon: '🧘‍♀️' },
  { id: '3', title: 'Read 10 Pages', icon: '📖' },
  { id: '4', title: 'No Screens After 10PM', icon: '🌙' },
];

const HabitItem = ({ habit, isCompleted, onToggle }) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(isCompleted ? 1 : 0);

  // Update progress value when isCompleted changes
  React.useEffect(() => {
    progress.value = withTiming(isCompleted ? 1 : 0, { duration: 300 });
  }, [isCompleted, progress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FFDAB9'] // White to Soft Peach
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        ['#4A4A4A', '#333333'] // Slate gray to slightly darker
      ),
      textDecorationLine: isCompleted ? 'line-through' : 'none',
      opacity: interpolateColor(progress.value, [0, 1], [1, 0.6]),
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { stiffness: 400, damping: 20 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 400, damping: 20 });
  };

  return (
    <Pressable
      onPress={() => onToggle(habit.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isCompleted }}
      accessibilityLabel={`Toggle habit: ${habit.title}`}
    >
      <Animated.View style={[styles.habitContainer, animatedContainerStyle]}>
        <View style={styles.habitContent}>
          <Text style={styles.habitIcon}>{habit.icon}</Text>
          <Animated.Text style={[styles.habitTitle, animatedTextStyle]}>
            {habit.title}
          </Animated.Text>
        </View>

        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxOutline} />
          <Animated.View style={[styles.checkboxFill, animatedCheckmarkStyle]}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [completedHabits, setCompletedHabits] = useState(new Set());

  const toggleHabit = (id) => {
    setCompletedHabits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const completionPercentage = HABITS.length > 0 ? completedHabits.size / HABITS.length : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.title}>Your Daily Glow ✨</Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {completedHabits.size} of {HABITS.length} completed
          </Text>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: `${completionPercentage * 100}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.listContainer}>
          {HABITS.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isCompleted={completedHabits.has(habit.id)}
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
    backgroundColor: '#FAFAFA', // Ultra-light off-white
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#4A4A4A', // Dark slate gray
    letterSpacing: -0.5,
  },
  progressSection: {
    marginBottom: 40,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFC0CB', // Blush pink
    borderRadius: 8,
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
    borderRadius: 20, // Soft rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOutline: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  checkboxFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: '#FFC0CB', // Blush pink fill
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
