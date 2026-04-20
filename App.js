import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Animated } from 'react-native';

const INITIAL_ROUTINE = [
  { id: '1', title: 'Hydrating Cleanser', time: 'Morning', completed: false },
  { id: '2', title: 'Vitamin C Serum', time: 'Morning', completed: false },
  { id: '3', title: 'Lightweight Moisturizer', time: 'Morning', completed: false },
  { id: '4', title: 'SPF 50 Sunscreen', time: 'Morning', completed: false },
  { id: '5', title: 'Gentle Exfoliator', time: 'Evening', completed: false },
  { id: '6', title: 'Night Cream', time: 'Evening', completed: false },
];

const RoutineItem = ({ item, onToggle }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onToggle(item.id);
  };

  return (
    <Animated.View style={[styles.itemContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[styles.itemTouchable, item.completed && styles.itemCompleted]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed }}
      >
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, item.completed && styles.itemTitleCompleted]}>{item.title}</Text>
          <Text style={[styles.itemTime, item.completed && styles.itemTimeCompleted]}>{item.time}</Text>
        </View>
        <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
          {item.completed && <View style={styles.checkboxInner} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [routine, setRoutine] = useState(INITIAL_ROUTINE);

  const toggleItem = (id) => {
    setRoutine(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const completedCount = routine.filter(r => r.completed).length;
  const progress = completedCount / routine.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerDate}>TODAY</Text>
          <Text style={styles.headerTitle}>Daily Glow</Text>
          <Text style={styles.headerSubtitle}>Nourish your skin, nourish your soul.</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{completedCount} of {routine.length} completed</Text>
        </View>

        <View style={styles.listContainer}>
          {routine.map(item => (
            <RoutineItem key={item.id} item={item} onToggle={toggleItem} />
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
  headerDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB6C1',
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2F4F4F',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#808080',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFDAB9',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#A9A9A9',
    fontWeight: '500',
  },
  listContainer: {
    gap: 16,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  itemTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  itemCompleted: {
    backgroundColor: '#FDFDFD',
    borderColor: '#F0F0F0',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  itemTitleCompleted: {
    color: '#D3D3D3',
    textDecorationLine: 'line-through',
  },
  itemTime: {
    fontSize: 14,
    color: '#A9A9A9',
  },
  itemTimeCompleted: {
    color: '#E0E0E0',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFDAB9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxCompleted: {
    backgroundColor: '#FFDAB9',
    borderColor: '#FFDAB9',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});