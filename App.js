import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat, withSequence, interpolateColor } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = ({ intention, onToggle }) => {
  const scaleAnim = useSharedValue(1);
  const breathAnim = useSharedValue(1);
  const bgProgress = useSharedValue(intention.completed ? 1 : 0);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      breathAnim.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      breathAnim.value = withTiming(1, { duration: 500 });
    }

    bgProgress.value = withTiming(intention.completed ? 1 : 0, { duration: 400 });
  }, [intention.priority, intention.completed]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      bgProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFC0CB' : '#F0F0F0', '#EAEAEA']
    );
    const opacity = interpolateColor(
      bgProgress.value,
      [0, 1],
      [1, 0.5]
    );

    return {
      transform: [
        { scale: scaleAnim.value },
        { scale: breathAnim.value }
      ],
      backgroundColor,
      borderColor,
      opacity
    };
  });

  return (
    <Pressable
      onPress={() => onToggle(intention.id)}
      onPressIn={() => { scaleAnim.value = withSpring(0.96); }}
      onPressOut={() => { scaleAnim.value = withSpring(1); }}
    >
      <Animated.View style={[styles.intentionContainer, animatedStyle]}>
        <Text style={[styles.intentionText, {
          color: intention.completed ? '#A0A0A0' : 'darkslategray',
          textDecorationLine: intention.completed ? 'line-through' : 'none'
        }]}>
          {intention.title}
        </Text>
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
    color: 'darkslategray',
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
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});