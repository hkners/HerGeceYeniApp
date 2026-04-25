import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Hydrate & Stretch', priority: 'medium', completed: false },
  { id: '3', title: 'Deep Work Session', priority: 'high', completed: false },
  { id: '4', title: 'Evening Reflection', priority: 'low', completed: false },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const IntentionCard = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(intention.completed ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    onToggle(intention.id);
    checked.value = withTiming(intention.completed ? 0 : 1, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FFFFFF', '#FFDAB9']
      ),
      borderColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#EAEAEA', '#FFC0CB']
      ),
      opacity: interpolateColor(checked.value, [0, 1], [1, 0.7]),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        checked.value,
        [0, 1],
        ['#2F4F4F', '#8A6A6A']
      ),
      textDecorationLine: checked.value > 0.5 ? 'line-through' : 'none',
    };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FAFAFA', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#D0D0D0', '#FFC0CB']
      ),
    };
  });

  return (
    <AnimatedPressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.intentionCard, animatedStyle]}
    >
      <View style={styles.cardContent}>
        <Animated.View style={[styles.customCheckbox, checkboxStyle]} />
        <Animated.Text style={[styles.intentionText, textStyle]}>
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
      <StatusBar style="dark" />
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
    color: '#2F4F4F',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#708090',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionCard: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 16,
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});