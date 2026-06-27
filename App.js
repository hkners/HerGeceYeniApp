import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation (10 min)', priority: 'high', completed: false },
  { id: '2', title: 'Hydrate: Drink 2L of water', priority: 'medium', completed: false },
  { id: '3', title: 'Read 20 pages of fiction', priority: 'medium', completed: false },
  { id: '4', title: 'Evening Stretch & Yoga', priority: 'high', completed: false },
];

const IntentionCard = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(intention.completed ? 1 : 0);

  React.useEffect(() => {
    checked.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed]);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: checked.value === 1 ? withTiming(0.7) : withTiming(1),
    };
  });

  const animatedCheckboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checked.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB']
    );
    const borderColor = interpolateColor(
      checked.value,
      [0, 1],
      ['#E0E0E0', '#FFC0CB']
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: checked.value,
      transform: [{ scale: checked.value }],
    };
  });

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={() => onToggle(intention.id)}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <Animated.View style={[styles.checkbox, animatedCheckboxStyle]}>
          <Animated.Text style={[styles.checkmark, animatedCheckmarkStyle]}>
            ✓
          </Animated.Text>
        </Animated.View>
        <Text style={[styles.cardText, intention.completed && styles.cardTextCompleted]}>
          {intention.title}
        </Text>
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
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
    letterSpacing: 0.5,
  },
  cardTextCompleted: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
});