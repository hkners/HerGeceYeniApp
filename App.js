import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { FlashList } from '@shopify/flash-list';
import { CheckCircle2, Plus, Sparkles, Wind } from 'lucide-react-native';
import { Canvas, Circle, SweepGradient, vec, Blur } from '@shopify/react-native-skia';

const { width, height } = Dimensions.get('window');

// Data
const INITIAL_TASKS = [
  { id: '1', title: 'Call Sarah at 4pm tomorrow', category: 'personal', completed: false },
  { id: '2', title: 'Review Q3 Design Specs', category: 'work', completed: false },
  { id: '3', title: 'Meditate for 10 minutes', category: 'ritual', completed: true },
  { id: '4', title: 'Buy groceries', category: 'personal', completed: false },
];

const CATEGORY_COLORS = {
  personal: '#FFDAB9', // Soft Peach
  work: '#FFC0CB',     // Blush Pink
  ritual: '#FFDAB9',   // Soft Peach (alternative: #FFC0CB)
};

// --- Skia Background ---
const AuraBackground = () => {
  const c = vec(width / 2, height / 2);
  const r = width;
  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{ flex: 1 }}>
        <Circle c={c} r={r}>
          <SweepGradient c={c} colors={['#FBFBFE', '#FFDAB9', '#FBFBFE', '#FFC0CB', '#FBFBFE']} />
          <Blur blur={50} />
        </Circle>
      </Canvas>
    </View>
  );
};

// --- Glass Header ---
const GlassHeader = () => {
  return (
    <BlurView intensity={30} tint="light" style={styles.headerContainer}>
      <SafeAreaView>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Aether</Text>
          <Wind color="#71717A" size={24} strokeWidth={1.5} />
        </View>
      </SafeAreaView>
      <View style={styles.headerBottomBorder} />
    </BlurView>
  );
};

// --- Orb Card (Task Item) ---
const OrbCard = React.memo(({ item, index, onToggle }) => {
  // Float animation
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [floatAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatAnim.value, [0, 1], [0, -8]);
    return {
      transform: [{ translateY }],
    };
  });

  // Scale animation on press
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const categoryColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.work;

  // Ritual specific styling
  const isRitual = item.category === 'ritual';
  const ritualBgColor = useSharedValue(item.completed ? categoryColor : '#FFFFFF');

  useEffect(() => {
    if (isRitual) {
      ritualBgColor.value = withTiming(item.completed ? categoryColor : '#FFFFFF', { duration: 500 });
    }
  }, [item.completed, isRitual, ritualBgColor, categoryColor]);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isRitual ? ritualBgColor.value : '#FFFFFF',
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(item.completed ? 0.4 : 1, { duration: 300 }),
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => onToggle(item.id)}
        style={styles.orbCardWrapper}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed }}
        accessibilityLabel={`Task: ${item.title}`}
      >
        <Animated.View style={[styles.orbCard, cardAnimatedStyle, pressStyle]}>
          {/* Light Leak */}
          <View style={[styles.lightLeak, { backgroundColor: categoryColor }]} />

          <Animated.Text style={[styles.orbText, textAnimatedStyle, item.completed && styles.orbTextCompleted]}>
            {item.title}
          </Animated.Text>

          {item.completed && (
            <Animated.View style={styles.checkIcon}>
               <CheckCircle2 color="#A1A1AA" size={20} strokeWidth={1.5} />
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// --- Vapor Input ---
const VaporInput = ({ onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState('');

  const rippleAnim = useSharedValue(0);
  const inputOpacity = useSharedValue(0);

  const toggleInput = () => {
    if (isExpanded) {
      // Close
      inputOpacity.value = withTiming(0, { duration: 200 }, () => {
        rippleAnim.value = withTiming(0, { duration: 400 }, (finished) => {
          if (finished) {
            runOnJS(setIsExpanded)(false);
          }
        });
      });
    } else {
      // Open
      setIsExpanded(true);
      rippleAnim.value = withTiming(1, { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
      inputOpacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) });
    }
  };

  const rippleStyle = useAnimatedStyle(() => {
    const scale = interpolate(rippleAnim.value, [0, 1], [0, 20]);
    return {
      transform: [{ scale }],
      opacity: interpolate(rippleAnim.value, [0, 1], [0.8, 0.95]),
    };
  });

  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: inputOpacity.value,
      transform: [
        { translateY: interpolate(inputOpacity.value, [0, 1], [20, 0]) }
      ]
    };
  });

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      toggleInput();
    }
  };

  return (
    <>
      {/* Ripple Overlay */}
      {isExpanded && (
         <View style={styles.rippleContainer} pointerEvents="none">
           <Animated.View style={[styles.ripple, rippleStyle]} />
         </View>
      )}

      {/* Input Field */}
      {isExpanded && (
        <Animated.View style={[styles.inputContainer, inputContainerStyle]} pointerEvents={isExpanded ? 'auto' : 'none'}>
          <Text style={styles.inputLabel}>Breathe and write...</Text>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="e.g. Call Sarah at 4pm tomorrow"
            placeholderTextColor="#A1A1AA"
            autoFocus
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          {/* NLP Highlight simulation */}
          {text.toLowerCase().includes('tomorrow') && (
            <Animated.View style={styles.nlpHighlight} pointerEvents="none">
               <Text style={styles.nlpText}>Time detected: Tomorrow</Text>
            </Animated.View>
          )}
        </Animated.View>
      )}

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fabWrapper}
        activeOpacity={0.8}
        onPress={toggleInput}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? "Close input" : "Add task"}
      >
        <View style={styles.fab}>
          {isExpanded ? <CheckCircle2 color="#71717A" size={24} strokeWidth={1.5} /> : <Plus color="#71717A" size={24} strokeWidth={1.5} />}
        </View>
      </TouchableOpacity>
    </>
  );
};


// --- Main App ---
export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // Breath Transition (Screen load)
  const screenScale = useSharedValue(0.95);
  const screenOpacity = useSharedValue(0);

  useEffect(() => {
    screenScale.value = withSpring(1, { damping: 20, stiffness: 90 });
    screenOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const screenStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: screenScale.value }],
      opacity: screenOpacity.value,
      flex: 1,
    };
  });

  const handleToggle = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const handleAdd = useCallback((title) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      category: 'work', // default
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const renderItem = useCallback(({ item, index }) => {
    return <OrbCard item={item} index={index} onToggle={handleToggle} />;
  }, [handleToggle]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AuraBackground />

      <Animated.View style={screenStyle}>
        <GlassHeader />

        <View style={styles.listContainer}>
          <FlashList
            data={tasks}
            renderItem={renderItem}
            estimatedItemSize={100}
            contentContainerStyle={styles.flashListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <VaporInput onAdd={handleAdd} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFE', // Soft Ice
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '400',
    color: '#2D2D2D',
    letterSpacing: 0.5,
  },
  headerBottomBorder: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  listContainer: {
    flex: 1,
    paddingTop: 100, // Space for header
  },
  flashListContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Space for FAB
    paddingTop: 20,
  },
  orbCardWrapper: {
    marginBottom: 20,
  },
  orbCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 32,
    padding: 24,
    minHeight: 80,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    overflow: 'hidden',
    // Inner shadow simulation for top-left highlight
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  lightLeak: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
    // Soft blur effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  orbText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '300',
    color: '#3F3F46',
    letterSpacing: 0.5,
    paddingRight: 30,
  },
  orbTextCompleted: {
    textDecorationLine: 'line-through',
  },
  checkIcon: {
    position: 'absolute',
    right: 24,
    top: '50%',
    marginTop: -10, // Adjust for size
  },
  // Vapor Input Styles
  fabWrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 20,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  rippleContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Translucent overlay
  },
  inputContainer: {
    position: 'absolute',
    top: height / 3,
    left: 24,
    right: 24,
    zIndex: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '300',
    color: '#A1A1AA',
    marginBottom: 8,
    letterSpacing: 1,
  },
  textInput: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2D2D2D',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  nlpHighlight: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  nlpText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  }
});
