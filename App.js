import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const CustomCheckbox = ({ checked }) => {
  const checkAnim = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    checkAnim.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked, checkAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        checkAnim.value,
        [0, 1],
        ['transparent', '#FFC0CB'] // Blush pink
      ),
      borderColor: interpolateColor(
        checkAnim.value,
        [0, 1],
        ['#EAEAEA', '#FFC0CB']
      ),
    };
  });

  return (
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </Animated.View>
  );
};

const BreathingContainer = ({ intention, onToggle }) => {
  const pulseAnim = useSharedValue(1);
  const scaleAnim = useSharedValue(1);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed, pulseAnim]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value * scaleAnim.value }],
      backgroundColor: intention.completed ? '#F7F7F7' : '#FFFFFF',
      borderColor: intention.completed ? '#EAEAEA' : (intention.priority === 'high' ? '#E8F4F8' : '#F0F0F0'),
      opacity: withTiming(intention.completed ? 0.6 : 1, { duration: 300 }),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: intention.completed ? '#A0A0A0' : '#4A4A4A',
      textDecorationLine: intention.completed ? 'line-through' : 'none',
    };
  });

  const onPressIn = () => {
    scaleAnim.value = withTiming(0.96, { duration: 150 });
  };

  const onPressOut = () => {
    scaleAnim.value = withTiming(1, { duration: 150 });
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => onToggle(intention.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
      accessibilityLabel={`Intention: ${intention.title}`}
      accessibilityHint={intention.completed ? "Mark intention as incomplete" : "Mark intention as complete"}
    >
      <Animated.View style={[styles.intentionContainer, animatedContainerStyle]}>
        <CustomCheckbox checked={intention.completed} />
        <Animated.Text style={[styles.intentionText, animatedTextStyle]}>
          {intention.title}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
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
    backgroundColor: '#FAFAFA', // Very light, clean background
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
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12, // completely round for clean girl aesthetic
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
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});
