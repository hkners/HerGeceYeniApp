## 2024-05-24 - React Native Animated.loop Resource Leak
**Learning:** In React Native, `Animated.loop` with `useNativeDriver: true` continues running indefinitely on the native thread, even if the component unmounts or `useEffect` dependencies change. `pulseAnim.setValue(1)` does not stop the underlying loop.
**Action:** Always capture the animation reference returned by `Animated.loop(...)` and explicitly call `.stop()` in the `useEffect` cleanup function to prevent orphaned animations and resource leaks.
