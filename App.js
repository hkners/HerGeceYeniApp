import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor
} from 'react-native-reanimated';

const INITIAL_INTENTIONS = [
  { id: '1', title: 'Morning Meditation', time: '08:00 AM', completed: false },
  { id: '2', title: 'Hydrate & Stretch', time: '09:00 AM', completed: false },
  { id: '3', title: 'Deep Work Session', time: '10:00 AM', completed: false },
  { id: '4', title: 'Review Weekly Goals', time: '04:00 PM', completed: false },
];

const IntentionItem = ({ item, onToggle }) => {
  const scale = useSharedValue(1);
  const checked = useSharedValue(item.completed ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    onToggle(item.id);
  };

  React.useEffect(() => {
    checked.value = withTiming(item.completed ? 1 : 0, { duration: 300 });
  }, [item.completed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FFFFFF', '#FAFAFA']
      ),
      borderColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FFDAB9', '#EAEAEA']
      ),
    };
  });

  const checkboxStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#FFFFFF', '#FFC0CB']
      ),
      borderColor: interpolateColor(
        checked.value,
        [0, 1],
        ['#E0E0E0', '#FFC0CB']
      ),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        checked.value,
        [0, 1],
        ['#4A4A4A', '#A0A0A0']
      ),
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Pressable
        style={styles.pressable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.checkbox, checkboxStyle]} />
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.title, textStyle, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
            {item.title}
          </Animated.Text>
          <Text style={styles.time}>{item.time}</Text>
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
          <Text style={styles.headerTitle}>Aura Flow</Text>
          <Text style={styles.headerSubtitle}>Breathe into your daily intentions.</Text>
        </View>

        <View style={styles.listContainer}>
          {intentions.map(intention => (
            <IntentionItem
              key={intention.id}
              item={intention}
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
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#888888',
  },
  listContainer: {
    gap: 16,
  },
  itemContainer: {
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    color: '#A0A0A0',
    fontWeight: '400',
  },
});