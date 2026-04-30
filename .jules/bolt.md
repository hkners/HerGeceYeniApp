## 2025-02-23 - Animated.loop Memory Leaks in React Native
**Learning:** In React Native, `Animated.loop` with `useNativeDriver: true` continues running indefinitely on the native thread even if the component unmounts or `useEffect` dependencies change, causing orphaned animations and resource leaks.
**Action:** Always capture the animation reference returned by `Animated.loop` and explicitly call `.stop()` in the `useEffect` cleanup function.
