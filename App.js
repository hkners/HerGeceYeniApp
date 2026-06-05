import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
  Easing
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const CustomCheckbox = ({ completed }) => {
  const progress = useSharedValue(completed ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(completed ? 1 : 0, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, [completed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#FFFFFF', '#FFDAB9'] // Soft peach when checked
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#EAEAEA', '#FFDAB9']
      ),
      transform: [{ scale: withSpring(completed ? 1.1 : 1) }]
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }]
    };
  });

  return (
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      <Animated.Text style={[styles.checkmark, checkmarkStyle]}>✓</Animated.Text>
    </Animated.View>
  );
};

const IntentionCard = ({ intention, onToggle }) => {
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
  }, [intention.priority, intention.completed]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { scale: pulseScale.value }
      ],
      opacity: withTiming(intention.completed ? 0.6 : 1, { duration: 300 })
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const getContainerStyle = () => {
    if (intention.priority === 'high' && !intention.completed) return styles.containerHighPriority;
    return styles.containerNormal;
  };

  const textColor = intention.completed ? '#A0A0A0' : '#4A4A4A';

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onToggle(intention.id)}
    >
      <Animated.View style={[styles.intentionContainer, getContainerStyle(), animatedContainerStyle]}>
        <CustomCheckbox completed={intention.completed} />
        <Text style={[styles.intentionText, { color: textColor, textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Text>
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
    marginBottom: 40,
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
  intentionContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  containerNormal: {
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  containerHighPriority: {
    borderWidth: 1,
    borderColor: '#FFF0F5',
    shadowColor: '#FFDAB9',
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.3,
    flex: 1,
  },
});
