import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const IntentionCard = React.memo(({ intention, onToggle }) => {
  const isPressed = useSharedValue(false);
  const isCompleted = useSharedValue(intention.completed ? 1 : 0);
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    isCompleted.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, isCompleted]);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(0);
    }
  }, [intention.priority, intention.completed, pulse]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(isPressed.value ? 0.96 : 1, { damping: 15, stiffness: 200 });
    const opacity = interpolate(isCompleted.value, [0, 1], [1, 0.6]);
    const borderColor = interpolateColor(
      isCompleted.value,
      [0, 1],
      ['#F0F0F0', '#EAEAEA']
    );

    let pulseScale = 1;
    if (intention.priority === 'high' && !intention.completed) {
      pulseScale = interpolate(pulse.value, [0, 1], [1, 1.02]);
    }

    return {
      transform: [{ scale: scale * pulseScale }],
      opacity,
      borderColor,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      isCompleted.value,
      [0, 1],
      ['#333333', '#A0A0A0']
    );
    return { color };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isCompleted.value,
      [0, 1],
      ['transparent', '#FFC0CB']
    );
    const borderColor = interpolateColor(
      isCompleted.value,
      [0, 1],
      ['#FFDAB9', '#FFC0CB']
    );
    return { backgroundColor, borderColor };
  });

  return (
    <AnimatedPressable
      style={[styles.intentionCard, animatedStyle]}
      onPressIn={() => (isPressed.value = true)}
      onPressOut={() => (isPressed.value = false)}
      onPress={() => onToggle(intention.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
      accessibilityLabel={intention.title}
    >
      <View style={styles.cardContent}>
        <Animated.View style={[styles.checkbox, checkboxStyle]}>
          {intention.completed && <Text style={styles.checkmark}>✓</Text>}
        </Animated.View>
        <Animated.Text style={[styles.intentionText, textStyle, intention.completed && styles.strikethrough]}>
          {intention.title}
        </Animated.Text>
      </View>
    </AnimatedPressable>
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
    marginBottom: 48,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    color: '#2F4F4F',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.2,
  },
  listContainer: {
    gap: 16,
  },
  intentionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  intentionText: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.3,
    flex: 1,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
});