import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', completed: false, description: '15 mins of mindful breathing' },
  { id: '2', title: 'Review Weekly Goals', completed: false, description: 'Align tasks with quarterly objectives' },
  { id: '3', title: 'Hydrate & Stretch', completed: false, description: 'Drink 2L water and 10 mins yoga' },
  { id: '4', title: 'Deep Work Session', completed: false, description: '2 hours of uninterrupted focus' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const IntentionCard = ({ intention, onToggle }) => {
  const isCompleted = intention.completed;
  const progress = useSharedValue(isCompleted ? 1 : 0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    progress.value = withTiming(isCompleted ? 1 : 0, { duration: 300 });
  }, [isCompleted, progress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFDAB9', '#EAEAEA'] // Soft peach to subtle gray
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ['darkslategray', '#A0A0A0']
    );
    return { color };
  });

  const animatedCheckboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', '#FFC0CB'] // Blush pink when checked
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFDAB9', '#FFC0CB']
    );
    return { backgroundColor, borderColor };
  });

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }]
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onToggle(intention.id)}
      style={[styles.card, animatedContainerStyle]}
      accessibilityRole="button"
      accessibilityState={{ checked: isCompleted }}
      accessibilityLabel={`Toggle intention: ${intention.title}`}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.intentionTitle, animatedTextStyle, isCompleted && styles.strikethrough]}>
            {intention.title}
          </Animated.Text>
          <Animated.Text style={[styles.intentionDescription, animatedTextStyle]}>
            {intention.description}
          </Animated.Text>
        </View>
        <Animated.View style={[styles.checkbox, animatedCheckboxStyle]}>
          <Animated.View style={[styles.checkmark, animatedCheckmarkStyle]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </Animated.View>
        </Animated.View>
      </View>
    </AnimatedPressable>
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

  const completedCount = intentions.filter(i => i.completed).length;
  const totalCount = intentions.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
          </Text>
          <Text style={styles.title}>Aura Flow</Text>
          <Text style={styles.subtitle}>Breathe into your daily intentions.</Text>

          <View style={styles.progressContainer}>
             <Text style={styles.progressText}>
               {completedCount} of {totalCount} intentions fulfilled
             </Text>
             <View style={styles.progressBarBg}>
               <Animated.View
                 style={[
                   styles.progressBarFill,
                   { width: `${(completedCount / totalCount) * 100}%` }
                 ]}
               />
             </View>
          </View>
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
    backgroundColor: '#FAFAFA', // Ultra-light off-white
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 60 : 40,
    paddingBottom: 60,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFDAB9', // Soft peach
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: 'darkslategray',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#A0A0A0',
    letterSpacing: 0.5,
    marginBottom: 30,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 13,
    color: 'darkslategray',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#EAEAEA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFC0CB', // Blush pink
    borderRadius: 2,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20, // Soft rounded corners
    borderWidth: 1,
    shadowColor: '#FFDAB9', // Soft peach shadow for airy feel
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  intentionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  intentionDescription: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.8,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14, // Circular checkbox
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
