import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BreathingContainer = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const completedProgress = useSharedValue(intention.completed ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    onToggle(intention.id);
  };

  // Update completed progress when intention.completed changes
  React.useEffect(() => {
    completedProgress.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#FFFFFF', '#FAFAFA']
    );
    const opacity = interpolateColor(completedProgress.value, [0, 1], [1, 0.6]);

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      opacity,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      completedProgress.value,
      [0, 1],
      ['#2F4F4F', '#A9A9A9']
    );
    return { color };
  });

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.intentionContainer, animatedContainerStyle]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
    >
      <Animated.Text style={[styles.intentionText, animatedTextStyle, { textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
        {intention.title}
      </Animated.Text>
    </AnimatedPressable>
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
    color: '#808080',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 20,
  },
  intentionContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF0F5',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});