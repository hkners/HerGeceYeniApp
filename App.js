import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', completed: false },
  { id: '2', title: 'Review Weekly Goals', completed: false },
  { id: '3', title: 'Hydrate & Stretch', completed: false },
  { id: '4', title: 'Deep Work Session', completed: false },
];

const IntentionItem = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const completedAnim = useSharedValue(intention.completed ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    const willBeCompleted = !intention.completed;
    completedAnim.value = withTiming(willBeCompleted ? 1 : 0, { duration: 300 });
    onToggle(intention.id);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['#FFFFFF', '#FAFAFA']
      ),
      borderColor: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['#FFDAB9', '#F0F0F0']
      ),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['#333333', '#A0A0A0']
      ),
    };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['#FFFFFF', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        completedAnim.value,
        [0, 1],
        ['#FFDAB9', '#FFC0CB']
      ),
    };
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.intentionContainer, animatedStyle]}>
        <Animated.View style={[styles.checkbox, checkboxStyle]} />
        <Animated.Text style={[
          styles.intentionText,
          textStyle,
          { textDecorationLine: intention.completed ? 'line-through' : 'none' }
        ]}>
          {intention.title}
        </Animated.Text>
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
            <IntentionItem
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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#666666',
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
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
  },
  intentionText: {
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});