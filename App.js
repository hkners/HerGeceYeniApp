import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = React.memo(({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const completedAnim = useSharedValue(intention.completed ? 1 : 0);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed, scale]);

  React.useEffect(() => {
    completedAnim.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, completedAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#FAFAFA', '#FAFAFA']
    );
    const opacity = intention.completed ? 0.6 : 1;

    return {
      transform: [
        { scale: scale.value },
        { scale: pressScale.value }
      ],
      borderColor,
      opacity,
      backgroundColor: '#FFFFFF',
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      completedAnim.value,
      [0, 1],
      ['#2F4F4F', '#A9A9A9']
    );
    return {
      color,
      textDecorationLine: intention.completed ? 'line-through' : 'none',
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      ['#FAFAFA', '#FFC0CB']
    );
    return {
      backgroundColor,
      borderColor: intention.completed ? '#FFC0CB' : '#E0E0E0',
    };
  });

  return (
    <Animated.View style={[styles.intentionContainer, animatedStyle]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
        onPressIn={() => { pressScale.value = withSpring(0.97); }}
        onPressOut={() => { pressScale.value = withSpring(1); }}
        onPress={() => onToggle(intention.id)}
        style={styles.pressableArea}
      >
        <Animated.View style={[styles.customCheckbox, checkmarkStyle]} />
        <Animated.Text style={[styles.intentionText, textAnimatedStyle]}>
          {intention.title}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
});

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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2F4F4F',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#708090',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  pressableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 16,
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});