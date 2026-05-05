import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = React.memo(({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1);
    }
  }, [intention.priority, intention.completed, pulseScale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { scale: pulseScale.value }
      ]
    };
  });

  const onPressIn = () => {
    scale.value = withTiming(0.96, { duration: 150 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  const getTextColor = () => {
    if (intention.completed) return '#A0A0A0';
    return '#2F4F4F'; // dark slate gray
  };

  return (
    <Animated.View style={[styles.intentionContainer, getContainerStyle(), animatedStyle]}>
      <Pressable
        onPress={() => onToggle(intention.id)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.pressableArea}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
      >
        <Text style={[styles.intentionText, { color: getTextColor(), textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Text>
        <View style={[styles.customCheckbox, intention.completed && styles.customCheckboxCompleted]}>
          {intention.completed && <View style={styles.customCheckboxInner} />}
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default function App() {
  const [intentions, setIntentions] = useState(INITIAL_INTENTIONS);

  const toggleIntention = React.useCallback((id) => {
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
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 20,
  },
  intentionContainer: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  pressableArea: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerNormal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  containerHighPriority: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFDAB9', // soft peach highlight
    shadowColor: '#FFDAB9',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  containerCompleted: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    opacity: 0.6,
  },
  intentionText: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    flex: 1,
  },
  customCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFC0CB', // blush pink
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  customCheckboxCompleted: {
    backgroundColor: '#FFC0CB',
  },
  customCheckboxInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
});
