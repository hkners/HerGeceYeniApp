import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, SafeAreaView, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', description: 'Clear the mind for 10 minutes.', priority: 'high', completed: false },
  { id: '2', title: 'Hydrate & Nourish', description: 'Drink 1L water before noon.', priority: 'medium', completed: false },
  { id: '3', title: 'Deep Work Flow', description: 'Uninterrupted design phase.', priority: 'high', completed: false },
  { id: '4', title: 'Evening Stretch', description: 'Release tension in shoulders.', priority: 'low', completed: false },
];

const Checkbox = ({ checked }) => {
  const progress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 300 });
  }, [checked, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FFDAB9']
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#E0E0E0', '#FFDAB9']
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  return (
    <Animated.View style={[styles.checkboxContainer, animatedStyle]}>
      <Animated.View style={[styles.checkMark, checkStyle]} />
    </Animated.View>
  );
};

const IntentionCard = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const checkedProgress = useSharedValue(intention.completed ? 1 : 0);

  React.useEffect(() => {
    checkedProgress.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, checkedProgress]);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checkedProgress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      checkedProgress.value,
      [0, 1],
      ['#F0F0F0', '#EAEAEA']
    );
    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      borderColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      checkedProgress.value,
      [0, 1],
      ['#2F4F4F', '#A9A9A9']
    );
    return { color };
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onToggle(intention.id)}
    >
      <Animated.View style={[styles.card, animatedContainerStyle]}>
        <View style={styles.cardContent}>
          <Text style={styles.priorityIndicator}>{intention.priority.toUpperCase()}</Text>
          <Animated.Text style={[styles.cardTitle, animatedTextStyle]}>
            {intention.title}
          </Animated.Text>
          <Text style={styles.cardDescription}>{intention.description}</Text>
        </View>
        <Checkbox checked={intention.completed} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default function App() {
  const [intentions, setIntentions] = useState(INITIAL_INTENTIONS);

  const toggleIntention = (id) => {
    setIntentions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = intentions.filter(i => i.completed).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Aura Flow</Text>
          <Text style={styles.subtitle}>Breathe into your intentions.</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{completedCount} of {intentions.length} completed</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {intentions.map((intention) => (
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
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2F4F4F',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#708090',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  progressText: {
    color: '#FFC0CB',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 2,
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    paddingRight: 16,
  },
  priorityIndicator: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFDAB9',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '300',
    color: '#708090',
  },
  checkboxContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
});