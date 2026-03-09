import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, Pressable } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler, State, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, withRepeat, interpolateColor, runOnJS, SlideInDown, SlideOutDown, useAnimatedGestureHandler } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { Canvas, BlurMask, Circle, SweepGradient, vec, RadialGradient, Group, Path, Skia } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const MOCK_ENTRIES = [
  { id: '1', time: 'Just past noon', text: 'I need to focus on deep work and let go of small distractions.', tint: '#FFC0CB' }, // Blush Pink
  { id: '2', time: 'Late afternoon', text: 'Taking a moment to breathe before my next meeting.', tint: '#FFDAB9' }, // Soft Peach
  { id: '3', time: 'Early evening', text: 'Feeling accomplished after a long day of coding.', tint: '#E0E7FF' }, // Periwinkle
];

const springConfig = { damping: 20, stiffness: 90 };

const PulseOrb = ({ onPress }) => {
  const isPressed = useSharedValue(false);
  const breathAnim = useSharedValue(1);

  React.useEffect(() => {
    breathAnim.value = withRepeat(
      withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      isPressed.value = true;
    } else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      isPressed.value = false;
      if (event.nativeEvent.state === State.END) {
        onPress();
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = isPressed.value ? withSpring(1.5, springConfig) : withSpring(breathAnim.value, springConfig);
    return {
      transform: [{ scale }],
    };
  });

  return (
    <LongPressGestureHandler onHandlerStateChange={onHandlerStateChange} minDurationMs={300}>
      <Animated.View style={[styles.orbContainer, animatedStyle]}>
        <Canvas style={styles.orbCanvas}>
          <Circle cx={80} cy={80} r={60}>
            <RadialGradient
              c={vec(80, 80)}
              r={60}
              colors={['#FFF4E5', '#E0E7FF']} // Champagne Glow to Periwinkle Mist
            />
            <BlurMask blur={20} style="normal" />
          </Circle>
        </Canvas>
        <Text style={styles.orbText}>Take a breath</Text>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const FeedItem = ({ item, onPress }) => (
  <Pressable onPress={() => onPress(item)}>
    <View style={styles.feedItem}>
      <BlurView intensity={60} tint="light" style={styles.feedItemBlur}>
        <View style={[styles.feedItemBorder, { borderColor: item.tint }]} />
        <Text style={styles.feedTime}>{item.time}</Text>
        <Text style={styles.feedText}>{item.text}</Text>
      </BlurView>
    </View>
  </Pressable>
);

const IntentionalityLayer = ({ activeItem, onClose }) => {
  if (!activeItem) return null;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.layerOverlay}>
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFillObject} />
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

      <Animated.View entering={SlideInDown.springify().damping(20).stiffness(90)} exiting={SlideOutDown} style={styles.layerPanel}>
        <View style={styles.layerHandle} />
        <Text style={styles.layerTitle}>Energy Tint</Text>
        <Text style={styles.layerSubtitle}>Swipe to adjust the hue</Text>

        <View style={styles.sliderContainer}>
          {/* Simple mock slider representation using Skia */}
          <Canvas style={styles.sliderCanvas}>
            <Circle cx={150} cy={15} r={10} color={activeItem.tint} />
            <BlurMask blur={5} style="normal" />
          </Canvas>
          <View style={styles.sliderTrack} />
        </View>

        <View style={styles.layerContentPreview}>
          <Text style={styles.feedText}>{activeItem.text}</Text>
        </View>

        <TouchableOpacity style={styles.layerCloseButton} onPress={onClose}>
          <Text style={styles.layerCloseText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const PulseView = () => {
  const [activeItem, setActiveItem] = useState(null);

  const mainScale = useSharedValue(1);
  const mainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(activeItem ? 0.95 : 1, springConfig) }],
  }));

  return (
    <View style={styles.pulseViewContainer}>
      <Animated.View style={[styles.pulseViewContainer, mainAnimatedStyle]}>
        <FlashList
          data={MOCK_ENTRIES}
          renderItem={({ item }) => <FeedItem item={item} onPress={setActiveItem} />}
          estimatedItemSize={120}
          contentContainerStyle={styles.feedContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.orbWrapper}>
          <PulseOrb onPress={() => console.log('Orb pressed')} />
        </View>
      </Animated.View>

      <IntentionalityLayer activeItem={activeItem} onClose={() => setActiveItem(null)} />
    </View>
  );
};

const NebulaView = () => {
  const scale = useSharedValue(1);

  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Mock points for the nebula scatter plot
  const points = Array.from({ length: 150 }).map((_, i) => ({
    x: Math.random() * width,
    y: Math.random() * (height * 0.6),
    r: Math.random() * 8 + 2,
    color: ['#FFC0CB', '#FFDAB9', '#E0E7FF', '#FFF4E5'][Math.floor(Math.random() * 4)],
    opacity: Math.random() * 0.6 + 0.2,
  }));

  return (
    <View style={styles.nebulaContainer}>
      <Text style={styles.nebulaTitle}>Monthly Insight</Text>
      <Text style={styles.nebulaSubtitle}>Pinch to explore your thoughts</Text>

      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <Animated.View style={[styles.nebulaCanvasWrapper, animatedStyle]}>
          <Canvas style={styles.nebulaCanvas}>
            {points.map((p, index) => (
              <Circle key={index} cx={p.x} cy={p.y} r={p.r} color={p.color} opacity={p.opacity}>
                <BlurMask blur={p.r * 1.5} style="normal" />
              </Circle>
            ))}
          </Canvas>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

const BreatheView = () => {
  const breatheAnim = useSharedValue(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const startBreathing = () => {
    setIsBreathing(true);
    breatheAnim.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }, (finished) => {
        if (finished) {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
      }),
      -1,
      true
    );
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    breatheAnim.value = withTiming(0, { duration: 1000 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolateColor(breatheAnim.value, [0, 1], [0.8, 1.2]); // Dummy to use interpolate color or simply interpolate
    return {
      transform: [{ scale: 0.8 + (breatheAnim.value * 0.4) }],
    };
  });

  return (
    <View style={styles.breatheContainer}>
      <Text style={styles.breatheTitle}>{isBreathing ? 'Inhale...' : 'Focus Timer'}</Text>
      <Text style={styles.breatheSubtitle}>
        {isBreathing ? 'Follow the circle' : 'Tap to begin your breathing session'}
      </Text>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={isBreathing ? stopBreathing : startBreathing}
        style={styles.breatheCircleWrapper}
      >
        <Animated.View style={[styles.breatheCircleAnimContainer, animatedStyle]}>
          <Canvas style={styles.breatheCanvas}>
            <Circle cx={150} cy={150} r={100} color="transparent" style="stroke" strokeWidth={1}>
              <RadialGradient
                c={vec(150, 150)}
                r={100}
                colors={['#E0E7FF', '#FFF4E5']}
              />
            </Circle>
          </Canvas>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.soundscapeContainer}>
        <Text style={styles.layerTitle}>Ambient Soundscapes</Text>
        <View style={styles.sliderContainer}>
          <Canvas style={styles.sliderCanvas}>
            <Circle cx={100} cy={15} r={8} color="#E0E7FF">
               <BlurMask blur={4} style="normal" />
            </Circle>
          </Canvas>
          <View style={styles.sliderTrack} />
        </View>
        <Text style={styles.layerSubtitle}>White Noise • Soft Rain</Text>
      </View>
    </View>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Pulse'); // 'Pulse', 'Breathe', 'Insight'

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />

        {/* Main Content Area */}
        <View style={styles.contentContainer}>
          {activeTab === 'Pulse' && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.tabContainer}>
              <PulseView />
            </Animated.View>
          )}

          {activeTab === 'Breathe' && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.tabContainer}>
              <BreatheView />
            </Animated.View>
          )}

          {activeTab === 'Insight' && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.tabContainer}>
              <NebulaView />
            </Animated.View>
          )}
        </View>

        {/* Minimal Navigation Bar */}
        <View style={styles.navBar}>
          {['Pulse', 'Breathe', 'Insight'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.navItem}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.navText, activeTab === tab && styles.navTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Off-White base layer
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  tabContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  pulseViewContainer: {
    flex: 1,
    width: '100%',
  },
  feedContainer: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 200,
  },
  feedItem: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 1,
  },
  feedItemBlur: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  feedItemBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderLeftWidth: 4,
  },
  feedTime: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '300',
    color: '#A0A0A0',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  feedText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '300',
    color: '#333333',
    lineHeight: 24,
  },
  layerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  layerPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  layerHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  layerTitle: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 8,
  },
  layerSubtitle: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    color: '#A0A0A0',
    marginBottom: 32,
  },
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 40,
  },
  sliderTrack: {
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 1,
    width: '100%',
  },
  sliderCanvas: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  layerContentPreview: {
    padding: 20,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    borderRadius: 16,
    marginBottom: 32,
  },
  layerCloseButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  layerCloseText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
  },
  orbWrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  orbContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbCanvas: {
    ...StyleSheet.absoluteFillObject,
  },
  orbText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    color: '#4A4A4A',
    zIndex: 1,
  },
  breatheContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    width: '100%',
  },
  breatheTitle: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '300',
    color: '#333333',
    marginBottom: 8,
  },
  breatheSubtitle: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    color: '#A0A0A0',
  },
  breatheCircleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  breatheCircleAnimContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breatheCanvas: {
    ...StyleSheet.absoluteFillObject,
  },
  soundscapeContainer: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
    paddingBottom: 60,
  },
  nebulaContainer: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    width: '100%',
  },
  nebulaTitle: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '300',
    color: '#333333',
    marginBottom: 8,
  },
  nebulaSubtitle: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    color: '#A0A0A0',
    marginBottom: 40,
  },
  nebulaCanvasWrapper: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  nebulaCanvas: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholderText: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '300',
    color: '#4A4A4A',
    letterSpacing: 0.5,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
  },
  navItem: {
    padding: 10,
  },
  navText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    color: '#A0A0A0',
    letterSpacing: 1,
  },
  navTextActive: {
    fontWeight: '500',
    color: '#333333',
  },
});
