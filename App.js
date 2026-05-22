import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

const DATA = [
  { id: '1', title: 'Drink a glass of water', description: 'Hydrate before coffee' },
  { id: '2', title: '10 min Meditation', description: 'Clear your mind' },
  { id: '3', title: 'Journaling', description: 'Write your morning pages' },
  { id: '4', title: 'Stretch', description: 'Wake up your body' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HabitItem = React.memo(({ item, isChecked, onToggle }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: withTiming(isChecked ? '#FFDAB9' : '#FFFFFF', { duration: 300 }),
      borderColor: withTiming(isChecked ? '#FFDAB9' : '#EFEFEF', { duration: 300 }),
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    onToggle(item.id);
  };

  return (
    <AnimatedPressable
      style={[styles.itemContainer, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      accessibilityLabel={`Toggle habit ${item.title}`}
      accessibilityHint={`Marks ${item.title} as ${isChecked ? 'incomplete' : 'complete'}`}
    >
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, isChecked && styles.itemTitleChecked]}>
          {item.title}
        </Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </AnimatedPressable>
  );
});

export default function App() {
  const [completedItems, setCompletedItems] = useState({});

  // Optimization: Functional state update allows empty dependency array []
  const handleToggle = useCallback((id) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const completedCount = Object.values(completedItems).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, Jane</Text>
          <Text style={styles.subtitle}>Let's start your day with intention.</Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {completedCount} of {DATA.length} habits completed
            </Text>
          </View>
        </View>

        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <HabitItem
              item={item}
              isChecked={!!completedItems[item.id]}
              onToggle={handleToggle}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#2F4F4F',
    opacity: 0.8,
    marginBottom: 24,
  },
  progressContainer: {
    backgroundColor: '#FFC0CB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  progressText: {
    color: '#2F4F4F',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderColor: '#EFEFEF',
  },
  itemContent: {
    flex: 1,
    paddingRight: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F4F4F',
    marginBottom: 4,
  },
  itemTitleChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  itemDescription: {
    fontSize: 14,
    color: '#2F4F4F',
    opacity: 0.7,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFC0CB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#FFC0CB',
    borderColor: '#FFC0CB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});