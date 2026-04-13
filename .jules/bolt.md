## 2024-05-25 - React Native Animated.loop Resource Leaks
**Learning:** In React Native, `Animated.loop` continues running indefinitely on the native thread (when `useNativeDriver: true`) even if the component re-renders and the `useEffect` dependencies change. This creates orphaned animations that consume CPU and battery, degrading performance over time.
**Action:** Always capture the animation reference returned by `Animated.loop` and explicitly call `.stop()` in the `useEffect` cleanup function when the loop is no longer needed.
