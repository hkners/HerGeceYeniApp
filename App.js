import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const InteractiveCard = ({ intention, onToggle }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(intention.completed ? 0.6 : 1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    onToggle(intention.id);
    opacity.value = withTiming(intention.completed ? 1 : 0.6, { duration: 300 });
  };

  const getContainerStyle = () => {
    if (intention.completed) return styles.containerCompleted;
    if (intention.priority === 'high') return styles.containerHighPriority;
    return styles.containerNormal;
  };

  return (
    <Animated.View style={[styles.intentionContainer, getContainerStyle(), animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.pressableArea}
      >
        <Text style={[
          styles.intentionText,
          {
            color: intention.completed ? '#A0A0A0' : '#4A4A4A',
            textDecorationLine: intention.completed ? 'line-through' : 'none'
          }
        ]}>
          {intention.title}
        </Text>

        {/* Custom Checkbox */}
        <View style={[styles.checkbox, intention.completed && styles.checkboxChecked]}>
           {intention.completed && <Text style={styles.checkIcon}>✓</Text>}
        </View>
      </Pressable>
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
            <InteractiveCard
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
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '300', color: '#2F4F4F', letterSpacing: 2, marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: '400', color: '#888888', letterSpacing: 0.5 },
  listContainer: { gap: 20 },
  intentionContainer: {
    borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  pressableArea: {
    paddingVertical: 24, paddingHorizontal: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  containerNormal: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F0F0F0' },
  containerHighPriority: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFDAB9' },
  containerCompleted: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EAEAEA' },
  intentionText: { fontSize: 16, fontWeight: '500', letterSpacing: 0.5, flex: 1 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#FFC0CB',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'
  },
  checkboxChecked: { backgroundColor: '#FFC0CB' },
  checkIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }
});