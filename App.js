import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

const DUMMY_TASKS = [
  { id: '1', title: 'Morning Meditation' },
  { id: '2', title: 'Hydrate (2L)' },
  { id: '3', title: 'Deep Work Session' },
  { id: '4', title: 'Read 10 Pages' },
  { id: '5', title: 'Evening Journaling' },
];

const TaskItem = React.memo(({ task, isCompleted, onToggle }) => {
  const scale = useSharedValue(1);
  const checkedProgress = useSharedValue(isCompleted ? 1 : 0);

  React.useEffect(() => {
    checkedProgress.value = withTiming(isCompleted ? 1 : 0, { duration: 300 });
  }, [isCompleted, checkedProgress]);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(
      checkedProgress.value,
      [0, 1],
      ['#FFDAB9', '#FFC0CB']
    ),
    backgroundColor: interpolateColor(
      checkedProgress.value,
      [0, 1],
      ['#FFFFFF', '#FFF0F5']
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      checkedProgress.value,
      [0, 1],
      ['#2F4F4F', '#A9A9A9']
    ),
  }));

  const animatedCheckboxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      checkedProgress.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB']
    ),
    borderColor: interpolateColor(
      checkedProgress.value,
      [0, 1],
      ['#FFDAB9', '#FFC0CB']
    ),
  }));

  const animatedCheckmarkStyle = useAnimatedStyle(() => ({
    opacity: checkedProgress.value,
    transform: [{ scale: checkedProgress.value }],
  }));

  return (
    <Pressable
      onPress={() => onToggle(task.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isCompleted }}
    >
      <Animated.View style={[styles.taskContainer, animatedContainerStyle]}>
        <Animated.View style={[styles.checkbox, animatedCheckboxStyle]}>
          <Animated.View style={[styles.checkmark, animatedCheckmarkStyle]} />
        </Animated.View>
        <Animated.Text style={[styles.taskText, animatedTextStyle]}>
          {task.title}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
});

export default function App() {
  const [completedTasks, setCompletedTasks] = useState({});

  const handleToggle = useCallback((id) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TaskItem
        task={item}
        isCompleted={!!completedTasks[item.id]}
        onToggle={handleToggle}
      />
    ),
    [completedTasks, handleToggle]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Daily Flow</Text>
        <Text style={styles.subtitle}>Embrace simplicity and focus.</Text>
      </View>
      <FlatList
        data={DUMMY_TASKS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#708090',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 16,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  taskText: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});