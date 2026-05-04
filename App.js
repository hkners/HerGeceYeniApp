import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring, interpolateColor } from 'react-native-reanimated';

const TASKS = [
  { id: '1', title: 'Morning Walk', description: '30 mins at the park' },
  { id: '2', title: 'Read Book', description: '1 chapter of Atomic Habits' },
  { id: '3', title: 'Hydrate', description: 'Drink 2L of water today' },
  { id: '4', title: 'Journal', description: 'Write down 3 things you are grateful for' }
];

const CustomCheckbox = ({ isChecked }) => {
  const progress = useSharedValue(isChecked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isChecked ? 1 : 0, { duration: 300 });
  }, [isChecked]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#FFC0CB']
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#E0E0E0', '#FFC0CB']
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: withSpring(isChecked ? 1.1 : 1) }]
    };
  });

  return (
    <Animated.View style={[styles.checkbox, animatedStyle]}>
      {isChecked && <Text style={styles.checkIcon}>✓</Text>}
    </Animated.View>
  );
};

const TaskCard = ({ task, onToggle }) => {
  const [isChecked, setIsChecked] = useState(false);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onToggle(task.id, newState);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleToggle}
        style={styles.cardContent}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked }}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.taskTitle, isChecked && styles.taskTitleCompleted]}>{task.title}</Text>
          <Text style={[styles.taskDescription, isChecked && styles.taskDescriptionCompleted]}>{task.description}</Text>
        </View>
        <CustomCheckbox isChecked={isChecked} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [completedTasks, setCompletedTasks] = useState({});

  const handleToggleTask = (id, isCompleted) => {
    setCompletedTasks(prev => ({ ...prev, [id]: isCompleted }));
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercentage = TASKS.length > 0 ? (completedCount / TASKS.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Flow</Text>
          <Text style={styles.subtitle}>Embrace your routine.</Text>
        </View>

        <View style={styles.progressContainer}>
           <View style={styles.progressBarBackground}>
              <Animated.View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
           </View>
           <Text style={styles.progressText}>{completedCount} of {TASKS.length} completed</Text>
        </View>

        <View style={styles.listContainer}>
          {TASKS.map(task => (
            <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
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
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F', // Dark slate gray
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#808080',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFDAB9', // Soft peach
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'right',
  },
  listContainer: {
    gap: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    color: '#B0C4DE',
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 14,
    color: '#808080',
  },
  taskDescriptionCompleted: {
    color: '#D3D3D3',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
