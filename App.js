import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = ({ intention, onToggle }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [intention.priority, intention.completed, pulseAnim]);

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  const getTextColor = () => {
    if (intention.completed) return '#A0A0A0';
    return '#4A4A4A';
  };

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onToggle(intention.id)}
        style={[styles.intentionContainer, getContainerStyle()]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: intention.completed }}
        accessibilityLabel={intention.title}
      >
        <Text style={[styles.intentionText, { color: getTextColor(), textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
          {intention.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
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
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerNormal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  containerHighPriority: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8F4F8', // Soft highlight (airy blue)
    shadowColor: '#A0D8E6',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  containerCompleted: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    opacity: 0.6,
  },
  intentionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});