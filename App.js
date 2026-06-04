import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const IntentionCard = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const completedProgress = useSharedValue(intention.completed ? 1 : 0);

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const onPress = () => {
    const newValue = !intention.completed;
    completedProgress.value = withTiming(newValue ? 1 : 0, { duration: 300 });
    onToggle(intention.id);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#F0F0F0', '#EAEAEA']
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      borderColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      completedProgress.value,
      [0, 1],
      ['#2F4F4F', '#A9A9A9']
    );
    return {
      color,
    };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      ['transparent', '#FFC0CB']
    );
    const borderColor = interpolateColor(
      completedProgress.value,
      [0, 1],
      ['#D3D3D3', '#FFC0CB']
    );
    return {
      backgroundColor,
      borderColor,
    };
  });

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={[styles.intentionContainer, animatedStyle]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
    >
      <View style={styles.cardContent}>
        <Animated.View style={[styles.customCheckbox, checkboxStyle]} />
        <Animated.Text
          style={[
            styles.intentionText,
            animatedTextStyle,
            intention.completed && styles.textCompleted
          ]}
        >
          {intention.title}
        </Animated.Text>
      </View>
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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Aura Flow</Text>
          <Text style={styles.subtitle}>Breathe into your daily intentions.</Text>
        </View>

        <View style={styles.listContainer}>
          {intentions.map(intention => (
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
    color: '#2F4F4F',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A9A9A9',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 20,
  },
  intentionContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    flex: 1,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
  },
});