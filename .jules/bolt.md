## 2024-05-21 - React Native Animated.loop Memory Leaks
**Learning:** In React Native, `Animated.loop` with `useNativeDriver: true` continues running on the native thread indefinitely even if the component unmounts or dependencies change, causing orphaned animations and resource leaks.
**Action:** Always capture the `Animated.loop` instance and explicitly call `.stop()` in the `useEffect` cleanup function.
