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
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const IntentionCard = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const completionProgress = useSharedValue(intention.completed ? 1 : 0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1);
    }
  }, [intention.priority, intention.completed, pulse]);

  useEffect(() => {
    completionProgress.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, completionProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );

    const borderColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#F0F0F0', '#EAEAEA']
    );

    return {
      transform: [
        { scale: scale.value },
        { scale: pulse.value }
      ],
      backgroundColor,
      borderColor,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      completionProgress.value,
      [0, 1],
      ['#333333', '#A0A0A0']
    );
    return { color };
  });

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={() => onToggle(intention.id)}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Animated.Text style={[styles.cardText, textAnimatedStyle, intention.completed && styles.textCompleted]}>
          {intention.title}
        </Animated.Text>
        <View style={[styles.radioContainer, intention.completed && styles.radioContainerCompleted]}>
          {intention.completed && <View style={styles.radioFilled} />}
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
          <Text style={styles.title}>Lumina</Text>
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
    color: '#333333',
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
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
  },
  radioContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioContainerCompleted: {
    borderColor: '#FFC0CB',
  },
  radioFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFC0CB',
  },
});