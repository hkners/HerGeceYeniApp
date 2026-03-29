import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  withRepeat,
  withSequence,
  runOnJS
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pulseAnim = useSharedValue(1);
  const completedAnim = useSharedValue(intention.completed ? 1 : 0);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed, pulseAnim]);

  React.useEffect(() => {
    completedAnim.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, completedAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#FAFAFA', '#FAFAFA']
    );

    return {
      transform: [
        { scale: scale.value },
        { scale: pulseAnim.value }
      ],
      backgroundColor,
      borderColor,
      opacity: intention.completed ? 0.6 : 1,
    };
  });

  const checkboxAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      ['#FAFAFA', '#FFC0CB']
    );

    return {
      backgroundColor,
      borderColor: intention.completed ? '#FFC0CB' : '#FFDAB9',
    };
  });

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={() => onToggle(intention.id)}
      accessibilityRole="button"
      accessibilityState={{ checked: intention.completed }}
      accessibilityLabel={intention.title}
    >
      <Animated.View style={[styles.intentionContainer, animatedStyle]}>
        <Animated.View style={[styles.checkbox, checkboxAnimatedStyle]} />
        <Text style={[styles.intentionText, intention.completed && styles.intentionTextCompleted]}>
          {intention.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [intentions, setIntentions] = useState(INITIAL_INTENTIONS);

  const toggleIntention = useCallback((id) => {
    setIntentions(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

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
            <BreathingContainer
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
    gap: 20,
  },
  intentionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: 'darkslategray',
    flex: 1,
  },
  intentionTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#FFC0CB',
  },
});