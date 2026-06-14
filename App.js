import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const Checkbox = ({ checked }) => {
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', '#FFC0CB']
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
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
    </Animated.View>
  );
};

const IntentionCard = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pulseAnim = useSharedValue(1);
  const completedProgress = useSharedValue(intention.completed ? 1 : 0);

  useEffect(() => {
    completedProgress.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed]);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1);
    }
  }, [intention.priority, intention.completed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { scale: pulseAnim.value }
      ],
      opacity: interpolate(completedProgress.value, [0, 1], [1, 0.6]),
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#F0F0F0', '#EAEAEA']
    );
    const backgroundColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );

    return {
      borderColor,
      backgroundColor,
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={() => onToggle(intention.id)}
    >
      <Animated.View style={[styles.intentionContainer, animatedStyle, borderStyle]}>
        <Checkbox checked={intention.completed} />
        <Text style={[
          styles.intentionText,
          intention.completed && styles.intentionTextCompleted
        ]}>
          {intention.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [intentions, setIntentions] = useState(INITIAL_INTENTIONS);

  const toggleIntention = (id) => {
    setIntentions(prev =>
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
          <Text style={styles.title}>Aura Flow</Text>
          <Text style={styles.subtitle}>Breathe into your daily intentions.</Text>
        </View>

        <View style={styles.listContainer}>
          {intentions.map(intention => (
            <IntentionCard
              key={intention.id}
              intention={intention}
              onToggle={toggleIntention}
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
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
    letterSpacing: 0.3,
  },
  intentionTextCompleted: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
