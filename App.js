import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const CustomCheckbox = ({ checked }) => {
  const progress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#FFFFFF', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#EAEAEA', '#FFC0CB']
      ),
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }],
    };
  });

  return (
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
    </Animated.View>
  );
};

const IntentionItem = React.memo(({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pulseAnim = useSharedValue(1);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
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
      transform: [
        { scale: scale.value },
        { scale: pulseAnim.value }
      ]
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  return (
    <Animated.View style={[animatedContainerStyle]}>
      <Pressable
        onPress={() => onToggle(intention.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.intentionContainer, getContainerStyle()]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
      >
        <View style={styles.intentionContent}>
          <Text style={[styles.intentionText, {
            color: intention.completed ? '#A0A0A0' : '#4A4A4A',
            textDecorationLine: intention.completed ? 'line-through' : 'none'
          }]}>
            {intention.title}
          </Text>
        </View>
        <CustomCheckbox checked={intention.completed} />
      </Pressable>
    </Animated.View>
  );
});

export default function App() {
  const [intentions, setIntentions] = useState(INITIAL_INTENTIONS);

  const toggleIntention = useCallback((id) => {
    setIntentions(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

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
    gap: 20,
  },
  intentionContainer: {
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerNormal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  containerHighPriority: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFDAB9',
    shadowColor: '#FFDAB9',
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  containerCompleted: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    opacity: 0.6,
  },
  intentionContent: {
    flex: 1,
    paddingRight: 16,
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});