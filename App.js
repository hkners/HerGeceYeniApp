import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomCheckbox = ({ checked }) => {
  const checkAnim = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    checkAnim.value = withTiming(checked ? 1 : 0, { duration: 300, easing: Easing.out(Easing.exp) });
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        checkAnim.value,
        [0, 1],
        ['#FFFFFF', '#FFDAB9']
      ),
      borderColor: interpolateColor(
        checkAnim.value,
        [0, 1],
        ['#EAEAEA', '#FFDAB9']
      ),
    };
  });

  const checkMarkStyle = useAnimatedStyle(() => {
    return {
      opacity: checkAnim.value,
      transform: [{ scale: checkAnim.value }]
    };
  });

  return (
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      <Animated.View style={[styles.checkMark, checkMarkStyle]} />
    </Animated.View>
  );
};

const BreathingContainer = React.memo(({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const breath = useSharedValue(1);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      breath.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      breath.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed]);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { scale: breath.value }
      ],
      opacity: withTiming(intention.completed ? 0.6 : 1, { duration: 300 }),
    };
  });

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onToggle(intention.id)}
      style={[styles.intentionContainer, getContainerStyle(), animatedContainerStyle]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
    >
      <View style={styles.intentionContent}>
        <CustomCheckbox checked={intention.completed} />
        <Text style={[
          styles.intentionText,
          {
            color: intention.completed ? '#A0A0A0' : '#333333',
            textDecorationLine: intention.completed ? 'line-through' : 'none'
          }
        ]}>
          {intention.title}
        </Text>
      </View>
    </AnimatedPressable>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    justifyContent: 'center',
  },
  intentionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  containerNormal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F9F9F9',
  },
  containerHighPriority: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFF0F5',
    shadowColor: '#FFC0CB',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  containerCompleted: {
    backgroundColor: '#Fdfdfd',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowOpacity: 0,
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  }
});