import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = React.memo(({ intention, onToggle }) => {
  const pulseAnim = useSharedValue(1);
  const scaleAnim = useSharedValue(1);
  const completedAnim = useSharedValue(intention.completed ? 1 : 0);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 500 });
    }

    completedAnim.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.priority, intention.completed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pulseAnim.value },
        { scale: scaleAnim.value }
      ],
      backgroundColor: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['#FFFFFF', '#FAFAFA']
      ),
      borderColor: interpolateColor(
        completedAnim.value,
        [0, 1],
        [intention.priority === 'high' ? '#FFDAB9' : '#F0F0F0', '#EAEAEA']
      ),
      opacity: interpolateColor(completedAnim.value, [0, 1], [1, 0.6])
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['#4A4A4A', '#A0A0A0']
      ),
    };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['transparent', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['#E0E0E0', '#FFC0CB']
      )
    };
  });

  const handlePressIn = () => {
    scaleAnim.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1);
    onToggle(intention.id);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
    >
      <Animated.View style={[styles.intentionContainer, animatedStyle]}>
        <Animated.View style={[styles.checkbox, checkboxStyle]} />
        <Animated.Text style={[styles.intentionText, textStyle, { textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
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
    color: '#333333',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 20,
  },
  intentionContainer: {
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
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
  },
});
