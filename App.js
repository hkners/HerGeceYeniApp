import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', completed: false },
  { id: '2', title: 'Review Weekly Goals', completed: false },
  { id: '3', title: 'Hydrate & Stretch', completed: false },
  { id: '4', title: 'Deep Work Session', completed: false },
];

const BreathingContainer = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(intention.completed ? 0.6 : 1);
  const progress = useSharedValue(intention.completed ? 1 : 0); // 0 = not completed, 1 = completed

  useEffect(() => {
    progress.value = withTiming(intention.completed ? 1 : 0, { duration: 400 });
    opacity.value = withTiming(intention.completed ? 0.6 : 1, { duration: 400 });
  }, [intention.completed]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFDAB9', '#EAEAEA'] // Peach accent when not completed
    );

    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      backgroundColor,
      borderColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ['#4A4A4A', '#A0A0A0']
    );
    return {
      color,
    };
  });

  // Custom checkbox animation
  const animatedCheckboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB'] // Blush pink when checked
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFDAB9', '#FFC0CB'] // Peach to Blush Pink
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={[styles.intentionContainer, animatedContainerStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onToggle(intention.id)}
        style={styles.innerContainer}
      >
        <Animated.View style={[styles.customCheckbox, animatedCheckboxStyle]}>
          {intention.completed && <Text style={styles.checkmark}>✓</Text>}
        </Animated.View>
        <Animated.Text style={[styles.intentionText, animatedTextStyle, { textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Animated.Text>
      </Pressable>
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
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#4A4A4A',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  innerContainer: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
    flex: 1,
  },
});
