## 2024-04-27 - Native Thread Memory Leak from Animated.loop
**Learning:** In React Native, `Animated.loop` with `useNativeDriver: true` continues running on the native thread indefinitely even if the component unmounts or its `useEffect` dependencies change, causing orphaned animations and resource leaks.
**Action:** Always capture the animation reference and explicitly call `.stop()` in the cleanup function of `useEffect` to prevent native thread memory leaks.
