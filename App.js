import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSpring,
  withSequence,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = React.memo(({ intention, onToggle }) => {
  const isHighPriority = intention.priority === 'high' && !intention.completed;

  const pulseAnim = useSharedValue(1);
  const scaleAnim = useSharedValue(1);

  React.useEffect(() => {
    if (isHighPriority) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 500 });
    }
  }, [isHighPriority, pulseAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pulseAnim.value * scaleAnim.value }
      ]
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
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => {
          scaleAnim.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scaleAnim.value = withSpring(1);
        }}
        onPress={() => onToggle(intention.id)}
        style={[styles.intentionContainer, getContainerStyle()]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
        accessibilityLabel={intention.title}
        accessibilityHint="Toggles intention completion"
      >
        <View style={styles.contentRow}>
          <View style={[styles.customCheckbox, intention.completed && styles.customCheckboxChecked]}>
            {intention.completed && <View style={styles.customCheckboxInner} />}
          </View>
          <Text style={[styles.intentionText, { color: getTextColor(), textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
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
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFDAB9', // Soft peach
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCheckboxChecked: {
    backgroundColor: '#FFDAB9',
    borderColor: '#FFDAB9',
  },
  customCheckboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  containerNormal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  containerHighPriority: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFC0CB', // Blush pink accent
    shadowColor: '#FFC0CB',
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  containerCompleted: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    opacity: 0.7,
  },
  intentionText: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});