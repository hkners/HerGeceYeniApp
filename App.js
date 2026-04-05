import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_HABITS = [
  { id: '1', title: 'Morning Meditation', subtitle: '10 minutes of mindfulness' },
  { id: '2', title: 'Hydration', subtitle: 'Drink 2 liters of water' },
  { id: '3', title: 'Journaling', subtitle: 'Write 3 things you are grateful for' },
  { id: '4', title: 'Gentle Stretching', subtitle: '15 minutes of yoga flow' },
];

const CustomCheckbox = ({ checked }) => {
  const progress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#FAFAFA', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#E0E0E0', '#FFC0CB']
      ),
      transform: [{ scale: withSpring(checked ? 1.1 : 1) }]
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }]
    };
  });

  return (
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
    </Animated.View>
  );
};

const HabitCard = ({ habit, onToggle }) => {
  const [checked, setChecked] = useState(false);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    if (onToggle) onToggle(habit.id, newCheckedState);
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(checked ? '#A9A9A9' : '#2F4F4F', { duration: 300 }),
      textDecorationLine: checked ? 'line-through' : 'none',
    };
  });

  return (
    <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.cardPressable}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={habit.title}
      >
        <View style={styles.cardContent}>
          <View style={styles.textContent}>
            <Animated.Text style={[styles.cardTitle, textStyle]}>{habit.title}</Animated.Text>
            <Text style={styles.cardSubtitle}>{habit.subtitle}</Text>
          </View>
          <CustomCheckbox checked={checked} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function App() {
  const [progressCount, setProgressCount] = useState(0);
  const progressPercent = (progressCount / INITIAL_HABITS.length) * 100;
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withTiming(progressPercent, { duration: 500 });
  }, [progressPercent, progressWidth]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  const handleToggle = (id, isChecked) => {
    setProgressCount(prev => isChecked ? prev + 1 : prev - 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning, ✨</Text>
          <Text style={styles.subtitle}>Let's flow through today with intention.</Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {progressCount} of {INITIAL_HABITS.length} completed
          </Text>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, progressStyle]} />
          </View>
        </View>

        <View style={styles.listContainer}>
          {INITIAL_HABITS.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
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
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#708090',
    letterSpacing: 0.2,
  },
  progressSection: {
    marginBottom: 40,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2F4F4F',
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#FAFAFA',
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
  cardWrapper: {
    backgroundColor: '#FAFAFA',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardPressable: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    paddingRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2F4F4F',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A9A9A9',
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});