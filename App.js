import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSpring,
  withSequence
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = React.memo(({ intention, onToggle }) => {
  const pulseAnim = useSharedValue(1);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pulseAnim.value },
        { scale: scaleAnim.value }
      ],
      opacity: intention.completed ? 0.6 : 1,
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    let borderColor = '#F0F0F0';
    if (intention.priority === 'high') borderColor = '#E8F4F8';

    return {
      borderColor: intention.completed ? '#EAEAEA' : borderColor,
      backgroundColor: intention.completed ? '#F7F7F7' : '#FFFFFF',
    };
  });

  const handlePressIn = () => {
    scaleAnim.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    onToggle(intention.id);
  };

  return (
    <Animated.View style={[styles.intentionContainerWrapper, animatedStyle, borderStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.intentionContainer}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
        accessibilityLabel={`Intention: ${intention.title}`}
        accessibilityHint={intention.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <View style={styles.contentRow}>
          <View style={[styles.customCheckbox, intention.completed && styles.customCheckboxChecked]}>
            {intention.completed && <View style={styles.checkboxInner} />}
          </View>
          <Text style={[styles.intentionText, intention.completed && styles.intentionTextCompleted]}>
            {intention.title}
          </Text>
        </View>
      </Pressable>
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
  intentionContainerWrapper: {
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  intentionContainer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFDAB9',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  customCheckboxChecked: {
    borderColor: '#FFC0CB',
    backgroundColor: '#FFF0F5',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFC0CB',
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: '#4A4A4A',
  },
  intentionTextCompleted: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
});
