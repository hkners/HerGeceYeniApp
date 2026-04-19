import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const CustomCheckbox = ({ checked, onPress, label }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    opacity.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked, opacity]);

  const animatedCheckStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: opacity.value }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={styles.checkboxWrapper}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Animated.View style={[styles.checkboxContainer, animatedContainerStyle]}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          <Animated.View style={[styles.checkmark, animatedCheckStyle]} />
        </View>
        <Text style={[styles.checkboxLabel, checked && styles.checkboxLabelChecked]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Morning meditation', completed: false },
    { id: 2, text: 'Matcha latte', completed: false },
    { id: 3, text: 'Journaling', completed: false },
    { id: 4, text: 'Pilates', completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.date}>Sunday, Oct 15</Text>
          <Text style={styles.title}>Your Daily Aura</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Morning Rituals</Text>
          <View style={styles.divider} />
          {tasks.map(task => (
            <CustomCheckbox
              key={task.id}
              label={task.text}
              checked={task.completed}
              onPress={() => toggleTask(task.id)}
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
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#FAFAFA',
  },
  header: {
    marginBottom: 40,
  },
  date: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  checkboxWrapper: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFDAB9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#FFC0CB',
    borderColor: '#FFC0CB',
  },
  checkmark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#2F4F4F',
    fontWeight: '400',
  },
  checkboxLabelChecked: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
});