import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
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
  const scale = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [checked, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    };
  });

  return (
    <View style={styles.checkboxContainer}>
      <Animated.View style={[styles.checkboxFill, animatedStyle]} />
    </View>
  );
};

const BreathingContainer = ({ intention, onToggle }) => {
  const pulseScale = useSharedValue(1);
  const pressedScale = useSharedValue(1);
  const progress = useSharedValue(intention.completed ? 1 : 0);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed, pulseScale]);

  React.useEffect(() => {
    progress.value = withTiming(intention.completed ? 1 : 0, { duration: 400 });
  }, [intention.completed, progress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFF5EE' : '#FFFFFF', '#FAFAFA']
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#F5F5F5', '#F0F0F0']
    );

    return {
      backgroundColor,
      borderColor,
      transform: [
        { scale: pulseScale.value },
        { scale: pressedScale.value }
      ],
      opacity: intention.completed ? 0.6 : 1,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ['#2F4F4F', '#A9A9A9']
    );

    return { color };
  });

  return (
    <Animated.View style={[styles.intentionContainer, animatedContainerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => { pressedScale.value = withSpring(0.96); }}
        onPressOut={() => { pressedScale.value = withSpring(1); }}
        onPress={() => onToggle(intention.id)}
        style={styles.touchableArea}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
      >
        <CustomCheckbox checked={intention.completed} />
        <Animated.Text style={[styles.intentionText, animatedTextStyle, intention.completed && { textDecorationLine: 'line-through' }]}>
          {intention.title}
        </Animated.Text>
      </TouchableOpacity>
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
    paddingTop: 80,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: '#2F4F4F',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: '#808080',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
    overflow: 'hidden',
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFC0CB',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxFill: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFDAB9',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});