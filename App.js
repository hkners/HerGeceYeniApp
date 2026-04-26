import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', completed: false },
  { id: '2', title: 'Review Weekly Goals', completed: false },
  { id: '3', title: 'Hydrate & Stretch', completed: false },
  { id: '4', title: 'Deep Work Session', completed: false },
];

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
    const newValue = !intention.completed;
    checked.value = withTiming(newValue ? 1 : 0, { duration: 300 });
    onToggle(intention.id);
  };

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: checked.value === 1 ? '#FAFAFA' : '#FFFFFF',
      borderColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FFDAB9', '#EAEAEA']
      ),
      opacity: checked.value === 1 ? 0.7 : 1,
    };
  });

  const rCheckboxStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FFFFFF', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FFDAB9', '#FFC0CB']
      ),
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        checked.value,
        [0, 1],
        ['#2F4F4F', '#A9A9A9']
      ),
    };
  });

  return (
    <Animated.View style={[styles.intentionContainer, rContainerStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
        style={styles.pressableArea}
      >
        <Animated.View style={[styles.checkbox, rCheckboxStyle]} />
        <Animated.Text style={[styles.intentionText, rTextStyle, { textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
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
          <Text style={styles.title}>Daily Flow</Text>
          <Text style={styles.subtitle}>Breathe into your intentions.</Text>
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
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#708090',
    letterSpacing: 0.2,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  pressableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
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
  },
});
