import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);
  const completedProgress = useSharedValue(intention.completed ? 1 : 0);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed, pulse]);

  useEffect(() => {
    completedProgress.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, completedProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const containerBgColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFC0CB' : '#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFC0CB' : '#F0F0F0', '#EAEAEA']
    );

    return {
      transform: [
        { scale: scale.value * pulse.value }
      ],
      backgroundColor: containerBgColor,
      borderColor: borderColor,
      opacity: 1 - (completedProgress.value * 0.4),
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        completedProgress.value,
        [0, 1],
        ['#FFFFFF', '#FFDAB9']
      ),
      borderColor: interpolateColor(
        completedProgress.value,
        [0, 1],
        ['#E0E0E0', '#FFDAB9']
      ),
    };
  });

  const innerCheckmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: completedProgress.value,
      transform: [{ scale: completedProgress.value }],
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      }}
      onPress={() => onToggle(intention.id)}
    >
      <Animated.View style={[styles.intentionContainer, animatedStyle]}>
        <View style={styles.contentRow}>
          <Animated.View style={[styles.customCheckbox, checkmarkStyle]}>
            <Animated.View style={[styles.innerCheckmark, innerCheckmarkStyle]} />
          </Animated.View>
          <Text
            style={[
              styles.intentionText,
              intention.completed && styles.intentionTextCompleted
            ]}
          >
            {intention.title}
          </Text>
        </View>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCheckmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F4F4F',
    letterSpacing: 0.5,
    flex: 1,
  },
  intentionTextCompleted: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
});
