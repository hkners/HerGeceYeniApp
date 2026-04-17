## 2024-05-23 - React Native Animated.loop Memory Leak
**Learning:** In React Native, when using `Animated.loop` with `useNativeDriver: true`, the animation continues running indefinitely on the native thread even if the component unmounts or `useEffect` dependencies change.
**Action:** Always capture the animation reference and explicitly call `.stop()` in the cleanup function to prevent orphaned animations and resource leaks.
