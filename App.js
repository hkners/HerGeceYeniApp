import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
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

const IntentionItem = React.memo(({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(intention.completed ? 1 : 0);
  const pulse = useSharedValue(1);

  // Update animated value when prop changes
  useEffect(() => {
    checked.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });

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
      pulse.value = withTiming(1, { duration: 300 });
    }
  }, [intention.completed, intention.priority]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      checked.value,
      [0, 1],
      ['#FFDAB9', '#EAEAEA'] // Soft peach to subtle gray
    );
    const backgroundColor = interpolateColor(
      checked.value,
      [0, 1],
      ['#FFFFFF', '#FAFAFA']
    );

    return {
      transform: [{ scale: scale.value * pulse.value }],
      borderColor,
      backgroundColor,
      opacity: checked.value ? 0.6 : 1,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      checked.value,
      [0, 1],
      ['#333333', '#A0A0A0']
    );
    return { color };
  });

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      opacity: checked.value,
      transform: [{ scale: checked.value }],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    onToggle(intention.id);
  };

  return (
    <Animated.View style={[styles.intentionContainer, animatedContainerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handlePress}
        style={styles.touchableArea}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
      >
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxBase}>
             <Animated.View style={[styles.checkboxFill, animatedCheckmarkStyle]} />
          </View>
        </View>

        <Animated.Text style={[styles.intentionText, animatedTextStyle]}>
          {intention.title}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
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
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFDAB9',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxFill: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFC0CB',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
});
