import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
  withSpring,
  Easing
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
  const checkedAnim = useSharedValue(intention.completed ? 1 : 0);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed, pulseAnim]);

  React.useEffect(() => {
    checkedAnim.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, checkedAnim]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      checkedAnim.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFC0CB' : '#F0F0F0', '#EAEAEA']
    );

    const backgroundColor = interpolateColor(
      checkedAnim.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );

    return {
      transform: [
        { scale: pulseAnim.value },
        { scale: scaleAnim.value }
      ],
      borderColor,
      backgroundColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      checkedAnim.value,
      [0, 1],
      ['#2F4F4F', '#A0A0A0']
    );
    return { color };
  });

  const animatedCheckboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checkedAnim.value,
      [0, 1],
      ['transparent', '#FFDAB9']
    );
    const borderColor = interpolateColor(
      checkedAnim.value,
      [0, 1],
      ['#EAEAEA', '#FFDAB9']
    );
    return { backgroundColor, borderColor };
  });

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: checkedAnim.value,
      transform: [{ scale: checkedAnim.value }]
    };
  });

  const handlePressIn = () => {
    scaleAnim.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1);
  };

  return (
    <Pressable
      onPress={() => onToggle(intention.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
      accessibilityLabel={`Toggle intention: ${intention.title}`}
    >
      <Animated.View style={[styles.intentionContainer, animatedContainerStyle]}>
        <Animated.View style={[styles.checkbox, animatedCheckboxStyle]}>
          <Animated.View style={[styles.checkmark, animatedCheckmarkStyle]} />
        </Animated.View>
        <Animated.Text style={[styles.intentionText, animatedTextStyle]}>
          {intention.title}
        </Animated.Text>
      </Animated.View>
    </Pressable>
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
    fontWeight: '300',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
    flex: 1,
  },
});
