import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring
} from 'react-native-reanimated';

const INITIAL_RITUALS = [
  { id: '1', title: 'Morning Matcha', time: '08:00 AM', completed: false },
  { id: '2', title: '5-Minute Journal', time: '08:30 AM', completed: false },
  { id: '3', title: 'Gua Sha Facial Massage', time: '09:00 AM', completed: false },
  { id: '4', title: 'Hydration (1L)', time: '12:00 PM', completed: false },
  { id: '5', title: 'Evening Wind Down', time: '09:00 PM', completed: false },
];

const CustomCheckbox = ({ checked }) => {
  const scale = useSharedValue(checked ? 1 : 0);
  const opacity = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0.5, { damping: 12 });
    opacity.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked, scale, opacity]);

  const animatedCheckStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.checkboxOutline}>
      <Animated.View style={[styles.checkboxFill, animatedCheckStyle]} />
    </View>
  );
};

const RitualCard = ({ ritual, onToggle }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(ritual.completed ? 0.6 : 1);

  React.useEffect(() => {
    opacity.value = withTiming(ritual.completed ? 0.6 : 1, { duration: 300 });
  }, [ritual.completed, opacity]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const getTextColor = () => {
    if (ritual.completed) return '#A0A0A0';
    return '#4A4A4A';
  };

  return (
    <Animated.View style={[styles.ritualContainer, animatedContainerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onToggle(ritual.id)}
        style={styles.ritualTouchable}
      >
        <View style={styles.ritualInfo}>
          <Text style={[styles.ritualTitle, { color: getTextColor(), textDecorationLine: ritual.completed ? 'line-through' : 'none' }]}>
            {ritual.title}
          </Text>
          <Text style={styles.ritualTime}>{ritual.time}</Text>
        </View>
        <CustomCheckbox checked={ritual.completed} />
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
          <Text style={styles.title}>Lumina</Text>
          <Text style={styles.subtitle}>Your daily wellness rituals.</Text>
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
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 16,
  },
  ritualContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  ritualTouchable: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ritualInfo: {
    flex: 1,
  },
  ritualTitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  ritualTime: {
    fontSize: 13,
    color: '#A0A0A0',
  },
  checkboxOutline: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFDAB9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  checkboxFill: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFC0CB',
  },
});