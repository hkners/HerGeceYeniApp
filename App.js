import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const IntentionCard = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);
  const completedAnim = useSharedValue(intention.completed ? 1 : 0);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1, // infinite
        false
      );
    } else {
      pulse.value = withTiming(1);
    }
  }, [intention.priority, intention.completed]);

  useEffect(() => {
    completedAnim.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#F0F0F0', '#EAEAEA']
    );

    const backgroundColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );

    return {
      transform: [{ scale: scale.value * pulse.value }],
      borderColor,
      backgroundColor,
      opacity: intention.completed ? 0.7 : 1,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB']
    );
    const brColor = interpolateColor(
      completedAnim.value,
      [0, 1],
      ['#E0E0E0', '#FFC0CB']
    );
    return {
      backgroundColor: bgColor,
      borderColor: brColor,
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <Animated.View style={[styles.intentionContainer, animatedContainerStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onToggle(intention.id)}
        style={styles.pressableArea}
        accessibilityRole="button"
        accessibilityState={{ checked: intention.completed }}
      >
        <Animated.View style={[styles.customCheckbox, checkmarkStyle]}>
          {intention.completed && <Text style={styles.checkmarkIcon}>✓</Text>}
        </Animated.View>
        <Text
          style={[
            styles.intentionText,
            { textDecorationLine: intention.completed ? 'line-through' : 'none' },
            intention.completed && styles.intentionTextCompleted,
          ]}
        >
          {intention.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default function App() {
  const [intentions, setIntentions] = useState(INITIAL_INTENTIONS);

  const toggleIntention = (id) => {
    setIntentions((prev) =>
      prev.map((item) =>
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
          {intentions.map((intention) => (
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
    gap: 16,
  },
  intentionContainer: {
    borderRadius: 20,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
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
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    letterSpacing: 0.5,
  },
  intentionTextCompleted: {
    color: '#A0A0A0',
  },
});