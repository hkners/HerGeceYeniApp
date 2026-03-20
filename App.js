import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
  Easing,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// --- COLORS (Clean Girl Aesthetic + Aura Concept) ---
const COLORS = {
  background: '#FAFAFA',
  cardBg: '#FFFFFF',
  text: '#2F4F4F', // Dark slate gray
  textLight: '#708090', // Lighter slate
  peach: '#FFDAB9',
  pink: '#FFC0CB',
  sage: '#E2E8E4', // Sage mist from concept
  periwinkle: '#E0E7FF', // Periwinkle frost from concept
  border: 'rgba(47, 79, 79, 0.1)', // Soft slate border
  shadow: 'rgba(0, 0, 0, 0.05)',
};

// --- DUMMY DATA ---
const INITIAL_TASKS = [
  { id: '1', title: 'Deep Work Session', energy: 'High', time: '10:00 AM', completed: false },
  { id: '2', title: 'Admin / Emails', energy: 'Low', time: '03:00 PM', completed: false },
  { id: '3', title: 'Creative Ideation', energy: 'Flow', time: '01:00 PM', completed: false },
  { id: '4', title: 'Evening Reflection', energy: 'Low', time: '08:00 PM', completed: false },
];

const HOLDING_PEN_ITEMS = [
  { id: 'h1', title: 'Call Mom' },
  { id: 'h2', title: 'Buy Groceries' },
  { id: 'h3', title: 'Read Chapter 4' },
];

// --- COMPONENTS ---

const BreathingOrb = ({ isFocusing, onToggle }) => {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  // Outer aura pulse
  const outerScale = useSharedValue(1);
  const outerOpacity = useSharedValue(0.2);

  useEffect(() => {
    if (isFocusing) {
      // Breathing animation (expanding and contracting)
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.9, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Color shift
      colorProgress.value = withTiming(1, { duration: 60000 }); // Shift color over 1 min for demo

      // Pulse animation
      outerScale.value = withRepeat(
        withTiming(1.6, { duration: 4000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      outerOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 2000, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );

    } else {
      scale.value = withTiming(1, { duration: 1000 });
      colorProgress.value = withTiming(0, { duration: 1000 });
      outerScale.value = withTiming(1, { duration: 1000 });
      outerOpacity.value = withTiming(0, { duration: 1000 });
    }
  }, [isFocusing, scale, colorProgress, outerScale, outerOpacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        colorProgress.value,
        [0, 1],
        [COLORS.periwinkle, COLORS.peach] // Cool blue to warm sunrise orange
      ),
    };
  });

  const outerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: outerScale.value }],
      opacity: outerOpacity.value,
      backgroundColor: interpolateColor(
        colorProgress.value,
        [0, 1],
        [COLORS.periwinkle, COLORS.peach]
      ),
    };
  });

  return (
    <View style={styles.orbContainer}>
      <Animated.View style={[styles.orbOuter, outerAnimatedStyle]} />
      <TouchableOpacity activeOpacity={0.8} onPress={onToggle}>
        <Animated.View style={[styles.orbInner, animatedStyle]}>
           <Text style={styles.orbText}>
             {isFocusing ? 'Focusing...' : 'Start Session'}
           </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const TaskCard = React.memo(({ task, onComplete }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    // Evaporate animation
    opacity.value = withTiming(0, { duration: 500 });
    translateY.value = withTiming(-20, { duration: 500 }, (finished) => {
        if (finished) {
           runOnJS(onComplete)(task.id);
        }
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const getEnergyColor = (energy) => {
    switch(energy) {
      case 'High': return COLORS.peach;
      case 'Flow': return COLORS.periwinkle;
      case 'Low': return COLORS.sage;
      default: return COLORS.textLight;
    }
  };

  return (
    <Animated.View style={[styles.taskCardWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.taskCard}
      >
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskTime}>{task.time}</Text>
        </View>
        <View style={styles.taskMeta}>
           <View style={[styles.energyDot, { backgroundColor: getEnergyColor(task.energy) }]} />
           <Text style={styles.energyText}>{task.energy}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const HoldingPenBubble = ({ item }) => {
   const translateY = useSharedValue(10);
   const opacity = useSharedValue(0);

   useEffect(() => {
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 800 });
   }, [translateY, opacity]);

   const animatedStyle = useAnimatedStyle(() => {
       return {
           transform: [{ translateY: translateY.value }],
           opacity: opacity.value,
       }
   });

   return (
      <Animated.View style={[styles.bubble, animatedStyle]}>
         <Text style={styles.bubbleText}>{item.title}</Text>
      </Animated.View>
   )
}


export default function App() {
  const [isFocusing, setIsFocusing] = useState(false);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // Simulate time-based greeting
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
      const hour = new Date().getHours();
      if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
      else if (hour >= 17) setGreeting('Good Evening');
  }, []);

  const handleToggleFocus = useCallback(() => {
    setIsFocusing((prev) => !prev);
  }, []);

  const handleCompleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter(t => t.id !== taskId));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}, User</Text>
          <Text style={styles.subtitle}>Your energy looks great today.</Text>
        </View>

        {/* Centerpiece: Soft Focus Timer */}
        <View style={styles.orbSection}>
           <BreathingOrb isFocusing={isFocusing} onToggle={handleToggleFocus} />
           <Text style={styles.orbHint}>
               {isFocusing ? 'Immersed in deep work.' : 'Tap to start a soft-focus session.'}
           </Text>
        </View>

        {/* Circadian Energy Map (Task List) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Energy Map</Text>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
            ))
          ) : (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>All tasks evaporate. You are clear.</Text>
            </View>
          )}
        </View>

        {/* The Holding Pen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Holding Pen</Text>
          <ScrollView
             horizontal
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={styles.holdingPenContainer}
          >
             {HOLDING_PEN_ITEMS.map((item) => (
                 <HoldingPenBubble key={item.id} item={item} />
             ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Dock (Faux Blur using transparency and shadow) */}
      <View style={styles.dockContainer}>
         <View style={styles.dock}>
            <View style={[styles.dockItem, styles.dockItemActive]} />
            <View style={styles.dockItem} />
            <View style={styles.dockItem} />
         </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '400',
  },
  orbSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  orbContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbOuter: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  orbInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.peach,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  orbText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
    opacity: 0.8,
  },
  orbHint: {
    marginTop: 20,
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  taskCardWrapper: {
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  taskMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  energyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  energyText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  emptyState: {
      padding: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.4)',
      borderRadius: 24,
  },
  emptyStateText: {
      color: COLORS.textLight,
      fontStyle: 'italic',
  },
  holdingPenContainer: {
     paddingVertical: 10,
     paddingRight: 20,
  },
  bubble: {
     backgroundColor: 'rgba(255, 255, 255, 0.6)',
     paddingHorizontal: 20,
     paddingVertical: 12,
     borderRadius: 30,
     marginRight: 12,
     borderWidth: 1,
     borderColor: COLORS.border,
  },
  bubbleText: {
     color: COLORS.text,
     fontSize: 14,
     fontWeight: '500',
  },
  dockContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dock: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 40,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    gap: 30,
  },
  dockItem: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
    opacity: 0.3,
  },
  dockItemActive: {
     opacity: 1,
     backgroundColor: COLORS.text,
     transform: [{scale: 1.5}],
  }
});