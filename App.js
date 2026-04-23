import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withRepeat, withSequence } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomCheckbox = ({ checked }) => {
  const scale = useSharedValue(checked ? 1 : 0);
  const opacity = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, { damping: 12, stiffness: 100 });
    opacity.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(checked ? '#FFDAB9' : 'transparent', { duration: 200 }),
    borderColor: withTiming(checked ? '#FFDAB9' : '#EAEAEA', { duration: 200 }),
  }));

  return (
    <Animated.View style={[styles.checkboxContainer, boxStyle]}>
      <Animated.View style={[styles.checkMark, checkStyle]} />
    </Animated.View>
  );
};

const IntentionItem = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { scale: pulse.value },
    ],
    opacity: withTiming(intention.completed ? 0.6 : 1, { duration: 300 }),
  }));

  const getBorderColor = () => {
    if (intention.completed) return '#F0F0F0';
    if (intention.priority === 'high') return '#FFC0CB';
    return '#F5F5F5';
  };

  return (
    <AnimatedPressable
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      onPress={() => onToggle(intention.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
      style={[
        styles.intentionCard,
        { borderColor: getBorderColor() },
        animatedStyle
      ]}
    >
      <View style={styles.intentionContent}>
        <CustomCheckbox checked={intention.completed} />
        <Text style={[
          styles.intentionText,
          intention.completed && styles.intentionTextCompleted
        ]}>
          {intention.title}
        </Text>
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
    paddingBottom: 60,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2C3E50',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#7F8C8D',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  intentionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkMark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  intentionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2C3E50',
    letterSpacing: 0.3,
    flex: 1,
  },
  intentionTextCompleted: {
    color: '#BDC3C7',
    textDecorationLine: 'line-through',
  },
});
