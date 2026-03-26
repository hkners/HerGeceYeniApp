import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = ({ intention, onToggle }) => {
  const pulseAnim = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pulseAnim.value },
        { scale: scale.value }
      ]
    };
  });

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  const getTextColor = () => {
    if (intention.completed) return '#A0A0A0'; // lighter text for completed
    return '#333333'; // dark slate gray text
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    onToggle(intention.id);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[styles.intentionContainer, getContainerStyle()]}
      >
        <View style={styles.intentionContent}>
          <Text style={[styles.intentionText, { color: getTextColor(), textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
            {intention.title}
          </Text>
          {/* Custom Aesthetic Checkbox Indicator */}
          <View style={[
              styles.checkboxContainer,
              intention.completed ? styles.checkboxCompleted : (intention.priority === 'high' ? styles.checkboxHigh : styles.checkboxNormal)
            ]}>
            {intention.completed && <View style={styles.checkboxInner} />}
          </View>
        </View>
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
    backgroundColor: '#FAFAFA', // Ultra-light off-white background
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
    fontWeight: '300', // Light font weight for elegance
    color: '#333333', // Dark slate gray
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16, // Spacious layout
  },
  intentionContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 24, // Soft rounded corners (16-24px)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  intentionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerNormal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  containerHighPriority: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFDAB9', // Soft peach highlight
    shadowColor: '#FFDAB9',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  containerCompleted: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    opacity: 0.5,
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '500', // Slightly bold for readability
    letterSpacing: 0.3,
    flex: 1,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12, // Completely round
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  checkboxNormal: {
    borderColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  checkboxHigh: {
    borderColor: '#FFC0CB', // Blush pink accent
    backgroundColor: 'transparent',
  },
  checkboxCompleted: {
    borderColor: '#FFDAB9', // Soft peach
    backgroundColor: '#FFDAB9',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // White dot inside
  }
});