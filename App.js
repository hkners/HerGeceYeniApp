import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', time: '8:00 AM' },
  { id: '2', title: 'Review Weekly Goals', time: '10:00 AM' },
  { id: '3', title: 'Hydrate & Stretch', time: '1:00 PM' },
  { id: '4', title: 'Deep Work Session', time: '3:00 PM' },
];

const IntentionCard = ({ intention, isCompleted, onToggle }) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(isCompleted ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const handlePress = () => {
    const nextState = !isCompleted;
    progress.value = withTiming(nextState ? 1 : 0, { duration: 300 });
    onToggle(intention.id);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#FFFFFF', '#FAFAFA']
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#FFDAB9', '#EAEAEA']
      ),
    };
  });

  const animatedCheckboxStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['transparent', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        ['#FFDAB9', '#FFC0CB']
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        ['#2F4F4F', '#A9A9A9']
      )
    };
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={[styles.card, animatedContainerStyle]}>
        <View style={styles.cardContent}>
          <Animated.View style={[styles.checkbox, animatedCheckboxStyle]} />
          <View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.title,
                animatedTextStyle,
                { textDecorationLine: isCompleted ? 'line-through' : 'none' }
              ]}
            >
              {intention.title}
            </Animated.Text>
            <Text style={styles.time}>{intention.time}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function App() {
  const [completedIds, setCompletedIds] = useState(new Set());

  const toggleIntention = (id) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Aura Flow</Text>
          <Text style={styles.headerSubtitle}>Breathe into your daily intentions.</Text>
        </View>

        <View style={styles.listContainer}>
          {INITIAL_INTENTIONS.map(intention => (
            <IntentionCard
              key={intention.id}
              intention={intention}
              isCompleted={completedIds.has(intention.id)}
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
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A9A9A9',
  },
});