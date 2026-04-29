import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withRepeat, Easing } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomCheckbox = React.memo(({ checked }) => {
  const checkStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(checked ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withTiming(checked ? 1 : 0.5, { duration: 200 }) }]
    };
  });

  return (
    <View style={[styles.checkboxContainer, checked && styles.checkboxContainerChecked]}>
      <Animated.View style={[styles.checkInner, checkStyle]} />
    </View>
  );
});

const BreathingContainer = React.memo(({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed, pulseScale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { scale: pulseScale.value }
      ],
      opacity: withTiming(intention.completed ? 0.6 : 1, { duration: 300 }),
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  return (
    <AnimatedPressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onToggle(intention.id)}
      style={[styles.intentionContainer, getContainerStyle(), animatedStyle]}
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
    fontWeight: '300',
    color: '#708090',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  intentionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerNormal: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  containerHighPriority: {
    borderWidth: 1,
    borderColor: '#FFDAB9',
    shadowColor: '#FFDAB9',
    shadowOpacity: 0.15,
  },
  containerCompleted: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#2F4F4F',
    letterSpacing: 0.3,
    marginLeft: 16,
  },
  intentionTextCompleted: {
    color: '#A9A9A9',
    textDecorationLine: 'line-through',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxContainerChecked: {
    borderColor: '#FFC0CB',
    backgroundColor: '#FFF0F5',
  },
  checkInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFC0CB',
  }
});
