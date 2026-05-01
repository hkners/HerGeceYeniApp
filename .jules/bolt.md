## 2026-05-01 - Prevent Native Animation Leaks in Expo
**Learning:** In Expo/React Native, using `Animated.loop` with `useNativeDriver: true` causes the animation to run indefinitely on the native thread. Even if the React component unmounts or the `useEffect` dependencies change, the native thread animation will leak if not explicitly stopped.
**Action:** Always capture the animation reference returned by `Animated.loop()` and explicitly call `.stop()` on it within the `useEffect` cleanup function to prevent orphaned native animations.
