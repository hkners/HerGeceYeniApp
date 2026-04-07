import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, SafeAreaView, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  interpolateColor,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = ({ intention, onToggle }) => {
  const isHighPriority = intention.priority === 'high' && !intention.completed;

  // Shared values for animation
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const bgTransition = useSharedValue(intention.completed ? 1 : 0);

  useEffect(() => {
    if (isHighPriority) {
      pulseScale.value = withRepeat(
        withTiming(1.02, { duration: 2000 }),
        -1, // infinite
        true // reverse
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 500 });
    }
  }, [isHighPriority, pulseScale]);

  useEffect(() => {
    bgTransition.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, bgTransition]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgTransition.value,
      [0, 1],
      [isHighPriority ? '#FFF5F7' : '#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      bgTransition.value,
      [0, 1],
      [isHighPriority ? '#FFC0CB' : '#F0F0F0', '#EAEAEA']
    );

    return {
      transform: [
        { scale: scale.value },
        { scale: pulseScale.value }
      ],
      backgroundColor,
      borderColor,
      opacity: intention.completed ? 0.6 : 1,
    };
  });

  const animatedCheckStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(intention.completed ? 1 : 0) }],
      opacity: withTiming(intention.completed ? 1 : 0, { duration: 200 })
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    onToggle(intention.id);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
      accessibilityLabel={`Toggle intention: ${intention.title}`}
    >
      <Animated.View style={[styles.intentionContainer, animatedContainerStyle, isHighPriority && !intention.completed && styles.containerHighPriorityShadow]}>
        <View style={styles.intentionContent}>
          <Text style={[
            styles.intentionText,
            intention.completed && styles.intentionTextCompleted,
            isHighPriority && !intention.completed && styles.intentionTextHighPriority
          ]}>
            {intention.title}
          </Text>
          {isHighPriority && !intention.completed && (
            <Text style={styles.priorityDot}>•</Text>
          )}
        </View>
        <View style={[styles.customCheckbox, intention.completed && styles.customCheckboxCompleted]}>
          <Animated.View style={animatedCheckStyle}>
            <Feather name="check" size={14} color="#FFFFFF" />
          </Animated.View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
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
    <SafeAreaProvider>
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

          <View style={styles.footer}>
             <Text style={styles.footerText}>Stay present.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure white background for Clean Girl aesthetic
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F', // Dark slate gray
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#808080', // Softer gray for subtitle
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16, // Airy spacing
  },
  intentionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24, // Soft, rounded corners
    borderWidth: 1,
    // Base shadow, overridden by reanimated for high priority
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  containerHighPriorityShadow: {
    shadowColor: '#FFC0CB', // Blush pink shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  intentionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#2F4F4F', // Dark slate gray
    letterSpacing: 0.3,
  },
  intentionTextCompleted: {
    color: '#A9A9A9',
    textDecorationLine: 'line-through',
  },
  intentionTextHighPriority: {
    fontWeight: '500',
    color: '#2F4F4F',
  },
  priorityDot: {
    color: '#FFDAB9', // Soft peach dot for high priority
    fontSize: 24,
    marginLeft: 8,
    lineHeight: 24,
  },
  customCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14, // Completely circular
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginLeft: 16,
  },
  customCheckboxCompleted: {
    backgroundColor: '#FFDAB9', // Soft peach for completed state
    borderColor: '#FFDAB9',
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#D3D3D3',
    fontStyle: 'italic',
    letterSpacing: 1,
  }
});