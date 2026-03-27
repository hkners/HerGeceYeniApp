import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS,
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
    checkAnim.value = withTiming(checked ? 1 : 0, { duration: 250 });
  }, [checked, checkAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        checkAnim.value,
        [0, 1],
        ['#FFFFFF', '#FFDAB9'] // White to Peach
      ),
      borderColor: interpolateColor(
        checkAnim.value,
        [0, 1],
        ['#EAEAEA', '#FFDAB9']
      ),
      transform: [{ scale: withSpring(checked ? 1.1 : 1, { damping: 10, stiffness: 100 }) }]
    };
  });

  return (
    <Animated.View style={[styles.checkbox, animatedStyle]}>
      {checked && <View style={styles.checkMark} />}
    </Animated.View>
  );
};

const IntentionItem = ({ intention, onToggle }) => {
  const scaleAnim = useSharedValue(1);
  const opacityAnim = useSharedValue(intention.completed ? 0.6 : 1);

  React.useEffect(() => {
    opacityAnim.value = withTiming(intention.completed ? 0.6 : 1, { duration: 300 });
  }, [intention.completed, opacityAnim]);

  const handlePressIn = () => {
    scaleAnim.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    onToggle(intention.id);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
      opacity: opacityAnim.value,
    };
  });

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  const getTextColor = () => {
    if (intention.completed) return '#A0A0A0';
    return '#333333';
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.intentionContainer, getContainerStyle(), animatedContainerStyle]}
      accessibilityRole="button"
      accessibilityState={{ checked: intention.completed }}
      accessibilityLabel={`Toggle ${intention.title}`}
    >
      <View style={styles.intentionContent}>
        <Text style={[styles.intentionText, { color: getTextColor(), textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Text>
      </View>
      <CustomCheckbox checked={intention.completed} />
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
            <IntentionItem
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
    backgroundColor: '#FAFAFA', // Very light, clean background
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
    color: '#333333', // Dark slate gray per requirement
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
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 24, // Soft, rounded corners
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  intentionContent: {
    flex: 1,
    marginRight: 16,
  },
  containerNormal: {
    // defaults
  },
  containerHighPriority: {
    borderColor: '#FFC0CB', // Blush pink highlight for high priority
    shadowColor: '#FFC0CB',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  containerCompleted: {
    backgroundColor: '#F7F7F7',
    borderColor: '#EAEAEA',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  }
});