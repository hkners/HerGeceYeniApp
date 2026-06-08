import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', completed: false },
  { id: '2', title: 'Review Weekly Goals', completed: false },
  { id: '3', title: 'Hydrate & Stretch', completed: false },
  { id: '4', title: 'Deep Work Session', completed: false },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const IntentionItem = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(intention.completed ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    const nextState = !intention.completed;
    checked.value = withTiming(nextState ? 1 : 0, { duration: 300 });
    onToggle(intention.id);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#F0F0F0', '#FFDAB9'] // Normal vs Soft peach
      ),
      backgroundColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FFFFFF', '#FAFAFA']
      )
    };
  });

  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checked.value }],
      opacity: checked.value,
    };
  });

  const textContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - checked.value * 0.5
    };
  });

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.intentionContainer, containerAnimatedStyle]}
    >
      <View style={styles.checkboxContainer}>
        <Animated.View style={[styles.checkbox, useAnimatedStyle(() => ({
          borderColor: interpolateColor(checked.value, [0, 1], ['#E0E0E0', '#FFC0CB']),
          backgroundColor: interpolateColor(checked.value, [0, 1], ['transparent', '#FFC0CB'])
        }))]}>
          <Animated.View style={[styles.innerCheck, checkmarkAnimatedStyle]} />
        </Animated.View>
      </View>
      <Animated.View style={[styles.textContainer, textContainerStyle]}>
        <Text style={[styles.intentionText, { textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Text>
      </Animated.View>
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
    marginBottom: 48,
  },
  title: {
    fontSize: 34,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.2,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 16,
    elevation: 1,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCheck: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#4A4A4A',
    letterSpacing: 0.3,
  },
});
