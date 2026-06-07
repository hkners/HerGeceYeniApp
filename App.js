import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const Checkbox = ({ checked }) => {
  const scale = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [checked, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.checkboxContainer}>
      <Animated.View style={[styles.checkboxFill, animatedStyle]} />
    </View>
  );
};

const BreathingContainer = ({ intention, onToggle }) => {
  const pulseAnim = useSharedValue(1);
  const scaleAnim = useSharedValue(1);
  const completionProgress = useSharedValue(intention.completed ? 1 : 0);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1, // Infinite repeat
        true // reverse
      );
    } else {
      pulseAnim.value = withTiming(1);
    }
  }, [intention.priority, intention.completed, pulseAnim]);

  useEffect(() => {
    completionProgress.value = withTiming(intention.completed ? 1 : 0, {
      duration: 300,
    });
  }, [intention.completed, completionProgress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFFFFF' : '#FFFFFF', '#F7F7F7']
    );

    const borderColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#F0F0F0', '#EAEAEA'] // Soft peach highlight for high priority
    );

    const opacity = interpolateColor(
      completionProgress.value,
      [0, 1],
      [1, 0.6]
    );

    return {
      transform: [
        { scale: pulseAnim.value },
        { scale: scaleAnim.value }
      ],
      backgroundColor,
      borderColor,
      opacity,
      shadowColor: intention.priority === 'high' && !intention.completed ? '#FFC0CB' : '#000', // Blush pink shadow for high priority
      shadowOpacity: intention.priority === 'high' && !intention.completed ? 0.15 : 0.03,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      completionProgress.value,
      [0, 1],
      ['#4A4A4A', '#A0A0A0']
    );
    return { color };
  });

  const handlePressIn = () => {
    scaleAnim.value = withSpring(0.97, { damping: 20, stiffness: 200 });
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1, { damping: 20, stiffness: 200 });
  };

  return (
    <Animated.View style={[styles.intentionContainer, animatedContainerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onToggle(intention.id)}
        style={styles.touchableContent}
      >
        <Checkbox checked={intention.completed} />
        <Animated.Text
          style={[
            styles.intentionText,
            animatedTextStyle,
            { textDecorationLine: intention.completed ? 'line-through' : 'none' } // textDecorationLine cannot be animated natively easily, keeping conditional
          ]}
        >
          {intention.title}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
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
    backgroundColor: '#FAFAFA', // Ultra-light off-white
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
    color: '#2F4F4F', // Dark slate gray
    letterSpacing: 3,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 24,
  },
  intentionContainer: {
    borderRadius: 24, // Soft rounded corners
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 3,
    overflow: 'hidden', // Ensure inner touches don't break border radius
  },
  touchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12, // Circular custom checkbox
    borderWidth: 2,
    borderColor: '#FFDAB9', // Soft peach border
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFC0CB', // Blush pink fill
  },
});
