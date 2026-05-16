import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring, interpolateColor, useDerivedValue } from 'react-native-reanimated';
import { CheckCircle2, Circle } from 'lucide-react-native';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', priority: 'high', completed: false },
  { id: '2', title: 'Review Weekly Goals', priority: 'medium', completed: false },
  { id: '3', title: 'Hydrate & Stretch', priority: 'low', completed: false },
  { id: '4', title: 'Deep Work Session', priority: 'high', completed: false },
];

const BreathingContainer = ({ intention, onToggle }) => {
  const scaleAnim = useSharedValue(1);

  React.useEffect(() => {
    if (intention.priority === 'high' && !intention.completed) {
      scaleAnim.value = withRepeat(
        withTiming(1.05, { duration: 2000 }),
        -1,
        true
      );
    } else {
      scaleAnim.value = withTiming(1, { duration: 500 });
    }
  }, [intention.priority, intention.completed, scaleAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const completionProgress = useSharedValue(intention.completed ? 1 : 0);

  React.useEffect(() => {
    completionProgress.value = withTiming(intention.completed ? 1 : 0, { duration: 300 });
  }, [intention.completed, completionProgress]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFFFFF' : '#FFFFFF', '#FAFAFA']
    );
    const borderColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      [intention.priority === 'high' ? '#FFDAB9' : '#F0F0F0', '#EAEAEA']
    );
    return { backgroundColor, borderColor };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      completionProgress.value,
      [0, 1],
      ['#2F4F4F', '#A0A0A0']
    );
    return { color };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPress={() => onToggle(intention.id)}
        style={({ pressed }) => [
            { transform: [{ scale: pressed ? 0.98 : 1 }] }
        ]}
      >
        <Animated.View style={[styles.intentionContainer, containerAnimatedStyle, intention.priority === 'high' && !intention.completed ? styles.containerHighPriority : null]}>
          <View style={styles.contentRow}>
             {intention.completed ? (
               <CheckCircle2 color="#FFC0CB" size={24} strokeWidth={2} />
             ) : (
               <Circle color="#D3D3D3" size={24} strokeWidth={2} />
             )}
            <Animated.Text style={[styles.intentionText, textAnimatedStyle, { textDecorationLine: intention.completed ? 'line-through' : 'none' }]}>
              {intention.title}
            </Animated.Text>
          </View>
        </Animated.View>
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
    backgroundColor: '#FFFFFF',
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
    fontWeight: '400',
    color: '#2F4F4F',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#808080',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  intentionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  containerHighPriority: {
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  intentionText: {
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
