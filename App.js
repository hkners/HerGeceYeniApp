import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const CustomCheckbox = ({ checked }) => {
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 250, easing: Easing.out(Easing.quad) });
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: progress.value > 0.5 ? '#FFC0CB' : 'transparent',
      borderColor: progress.value > 0.5 ? '#FFC0CB' : '#EAEAEA',
      transform: [{ scale: checked ? 1.1 : 1 }, { scale: progress.value * 0.1 + 1 }],
    };
  });

  return (
    <Animated.View style={[styles.checkbox, animatedStyle]}>
      {checked && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </Animated.View>
  );
};

const BreathingContainer = ({ intention, onToggle }) => {
  const scaleAnim = useSharedValue(1);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      scaleAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      scaleAnim.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleAnim.value },
        { scale: pressScale.value }
      ]
    };
  });

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  const getTextColor = () => {
    if (intention.completed) return '#A0A0A0';
    return '#4A4A4A';
  };

  return (
    <Animated.View style={[animatedContainerStyle]}>
      <Pressable
        onPressIn={() => { pressScale.value = withTiming(0.97, { duration: 150 }); }}
        onPressOut={() => { pressScale.value = withTiming(1, { duration: 150 }); }}
        onPress={() => onToggle(intention.id)}
        style={[styles.intentionContainer, getContainerStyle()]}
      >
        <CustomCheckbox checked={intention.completed} />
        <Text style={[styles.intentionText, { color: getTextColor(), textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Text>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  containerCompleted: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    opacity: 0.6,
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  }
});