import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';

const INITIAL_TASKS = [
  { id: '1', title: 'Morning Skincare Routine', completed: false },
  { id: '2', title: 'Drink 2L of Water', completed: false },
  { id: '3', title: 'Read 10 Pages', completed: false },
  { id: '4', title: 'Evening Walk', completed: false },
];

const CustomCheckbox = ({ checked, onPress, title }) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(checked ? 1 : 0);

  const handlePressIn = () => { scale.value = withSpring(0.95); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FFDAB9'] // White to Soft Peach
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#EAEAEA', '#FFC0CB'] // Light Gray to Blush Pink
    );
    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      borderColor,
    };
  });

  const checkMarkStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
     const color = interpolateColor(
        progress.value,
        [0, 1],
        ['darkslategray', '#A0A0A0']
     );
     return {
        color,
        textDecorationLine: progress.value === 1 ? 'line-through' : 'none',
     }
  });

  const toggle = () => {
    progress.value = withTiming(checked ? 0 : 1, { duration: 300 });
    onPress();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={toggle}
      style={styles.taskContainer}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={title}
    >
      <Animated.View style={[styles.checkboxCircle, animatedStyle]}>
        <Animated.Text style={[styles.checkMark, checkMarkStyle]}>✓</Animated.Text>
      </Animated.View>
      <Animated.Text style={[styles.taskText, textStyle]}>{title}</Animated.Text>
    </Pressable>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Grace</Text>
          <Text style={styles.subtitle}>Cultivate your daily habits.</Text>
        </View>

        <View style={styles.listContainer}>
          {tasks.map(task => (
            <CustomCheckbox
              key={task.id}
              checked={task.completed}
              onPress={() => toggleTask(task.id)}
              title={task.title}
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
  title: { fontSize: 32, fontWeight: '300', color: 'darkslategray', letterSpacing: 1.5, marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '400', color: '#888888', letterSpacing: 0.5 },
  listContainer: { gap: 16 },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  checkboxCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: 'darkslategray', fontSize: 16, fontWeight: '600' },
  taskText: { fontSize: 18, fontWeight: '400', letterSpacing: 0.3 },
});