## 2025-04-18 - Animated.loop Memory Leaks with useNativeDriver
**Learning:** In React Native, `Animated.loop` with `useNativeDriver: true` continues running on the native thread even if the component unmounts or `useEffect` dependencies change, creating resource leaks.
**Action:** Always capture the animation reference and explicitly call `.stop()` in the cleanup function.
