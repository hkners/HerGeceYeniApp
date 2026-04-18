import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', subtitle: '15 mins of mindfulness', completed: false },
  { id: '2', title: 'Review Weekly Goals', subtitle: 'Check Notion board', completed: false },
  { id: '3', title: 'Hydrate & Stretch', subtitle: 'Drink 2L of water', completed: false },
  { id: '4', title: 'Deep Work Session', subtitle: '90 mins of focused work', completed: false },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomCheckbox = ({ checked }) => {
  const scale = useSharedValue(checked ? 1 : 0);
  const opacity = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, { damping: 12, stiffness: 100 });
    opacity.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked, scale, opacity]);

  const innerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.checkboxContainer}>
      <Animated.View style={[styles.checkboxInner, innerStyle]} />
    </View>
  );
};

const IntentionItem = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    return styles.containerNormal;
  };

  const getTextColor = () => {
    if (intention.completed) return '#A0A0A0';
    return '#4A4A4A'; // Dark slate gray
  };

  return (
    <AnimatedPressable
      onPress={() => onToggle(intention.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.intentionContainer, animatedStyle, getContainerStyle()]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: intention.completed }}
    >
      <View style={styles.intentionContent}>
        <Text style={[styles.intentionText, { color: getTextColor(), textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Text>
        <Text style={[styles.intentionSubtitle, { color: getTextColor() }]}>
          {intention.subtitle}
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
    backgroundColor: '#FAFAFA', // Ultra-light off-white
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
    color: '#4A4A4A', // Premium dark slate gray
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20, // Soft rounded corners
    backgroundColor: '#FFFFFF', // Pure white
    shadowColor: '#FFC0CB', // Blush pink shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  containerNormal: {
    borderWidth: 1,
    borderColor: '#FFF0F5', // Lavender blush
  },
  containerCompleted: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowOpacity: 0,
    elevation: 0,
  },
  intentionContent: {
    flex: 1,
  },
  intentionText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  intentionSubtitle: {
    fontSize: 14,
    fontWeight: '300',
    opacity: 0.8,
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFDAB9', // Soft peach
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginLeft: 16,
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFDAB9', // Soft peach
  },
});