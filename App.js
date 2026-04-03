import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const INITIAL_RITUALS = [
  { id: '1', title: 'Morning Matcha', completed: false, time: '08:00 AM' },
  { id: '2', title: 'Journaling (3 Pages)', completed: false, time: '09:00 AM' },
  { id: '3', title: 'Pilates Flow', completed: false, time: '06:00 PM' },
  { id: '4', title: 'Skincare Routine', completed: false, time: '09:30 PM' },
];

const RitualCard = ({ ritual, onToggle }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(ritual.completed ? 0.6 : 1, { duration: 300 });
  }, [ritual.completed]);

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
    onToggle(ritual.id);
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, ritual.completed && styles.cardCompleted]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: ritual.completed }}
        accessibilityLabel={ritual.title}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.timeText, ritual.completed && styles.timeTextCompleted]}>{ritual.time}</Text>
          <View style={[styles.customCheckbox, ritual.completed && styles.customCheckboxChecked]}>
             {ritual.completed && <View style={styles.innerCheckbox} />}
          </View>
        </View>
        <Text style={[styles.titleText, ritual.completed && styles.titleTextCompleted]}>
          {ritual.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function App() {
  const [rituals, setRituals] = useState(INITIAL_RITUALS);

  const toggleRitual = (id) => {
    setRituals(prev =>
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
          <Text style={styles.headerTitle}>Lumina</Text>
          <Text style={styles.headerSubtitle}>Curate your daily rituals.</Text>
        </View>

        <View style={styles.listContainer}>
          {rituals.map(ritual => (
            <RitualCard
              key={ritual.id}
              ritual={ritual}
              onToggle={toggleRitual}
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
    marginBottom: 48,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: 'darkslategray',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#A0A0A0',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#FFDAB9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardCompleted: {
    backgroundColor: '#F9F9F9',
    borderColor: '#EFEFEF',
    shadowOpacity: 0.05,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFC0CB',
    letterSpacing: 1,
  },
  timeTextCompleted: {
    color: '#D3D3D3',
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFDAB9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  customCheckboxChecked: {
    borderColor: '#EFEFEF',
    backgroundColor: '#EFEFEF',
  },
  innerCheckbox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#A0A0A0',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'darkslategray',
    letterSpacing: 0.2,
  },
  titleTextCompleted: {
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
  },
});
