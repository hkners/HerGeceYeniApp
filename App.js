import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', completed: false },
  { id: '2', title: 'Hydrate & Stretch', completed: false },
  { id: '3', title: 'Deep Work Session', completed: false },
  { id: '4', title: 'Journal Reflections', completed: false },
];

const IntentionCard = ({ intention, onToggle }) => {
  const isCompleted = intention.completed;
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const completionProgress = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    completionProgress.value = withTiming(isCompleted ? 1 : 0, { duration: 400 });

    if (!isCompleted) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 400 });
    }
  }, [isCompleted]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      ['#FFDAB9', '#EAEAEA']
    );
    return {
      transform: [
        { scale: scale.value },
        { scale: pulseScale.value }
      ],
      backgroundColor,
      borderColor,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      completionProgress.value,
      [0, 1],
      ['#2F4F4F', '#A0A0A0']
    );
    return {
      color,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    const opacity = completionProgress.value;
    const scaleCheck = interpolate(completionProgress.value, [0, 1], [0.5, 1]);
    return {
      opacity,
      transform: [{ scale: scaleCheck }],
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={() => onToggle(intention.id)}
    >
      <Animated.View style={[styles.intentionContainer, animatedStyle]}>
        <View style={styles.leftContent}>
          <View style={styles.customCheckbox}>
             <Animated.View style={[styles.checkmark, checkmarkStyle]} />
          </View>
          <Animated.Text
            style={[
              styles.intentionText,
              textAnimatedStyle,
              { textDecorationLine: isCompleted ? 'line-through' : 'none' }
            ]}
          >
            {intention.title}
          </Animated.Text>
        </View>
      </Animated.View>
    </Pressable>
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
    color: '#2F4F4F',
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
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFC0CB',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFDAB9',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
});