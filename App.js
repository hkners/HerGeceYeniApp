import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  interpolateColor,
  withSequence,
  cancelAnimation
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = React.memo(({ intention, onToggle }) => {
  const isCompleted = intention.completed;
  const isHighPriority = intention.priority === 'high' && !isCompleted;

  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);
  const colorProgress = useSharedValue(isCompleted ? 1 : 0);

  React.useEffect(() => {
    if (isHighPriority) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 300 });
    }
  }, [isHighPriority, pulse]);

  React.useEffect(() => {
    colorProgress.value = withTiming(isCompleted ? 1 : 0, { duration: 300 });
  }, [isCompleted, colorProgress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [isHighPriority ? '#FFDAB9' : '#F0F0F0', '#EAEAEA']
    );

    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );

    return {
      transform: [
        { scale: scale.value },
        { scale: pulse.value }
      ],
      borderColor,
      backgroundColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#2F4F4F', '#A0A0A0']
    );
    return { color };
  });

  const animatedCheckboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB']
    );
    const borderColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#E0E0E0', '#FFC0CB']
    );
    return { backgroundColor, borderColor };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable
      onPress={() => onToggle(intention.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isCompleted }}
      accessibilityLabel={`Intention: ${intention.title}`}
    >
      <Animated.View style={[styles.intentionContainer, animatedContainerStyle, isHighPriority && !isCompleted && styles.glow]}>
        <Animated.View style={[styles.checkbox, animatedCheckboxStyle]}>
           {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </Animated.View>
        <Animated.Text style={[styles.intentionText, animatedTextStyle, isCompleted && styles.strikethrough]}>
          {intention.title}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
});

export default function App() {
  const [intentions, setIntentions] = useState(INITIAL_INTENTIONS);

  const toggleIntention = React.useCallback((id) => {
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
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
    letterSpacing: 2.5,
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
    borderWidth: 1.5,
  },
  glow: {
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  }
});