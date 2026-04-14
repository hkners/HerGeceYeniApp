## 2024-05-24 - Animated.loop Memory Leak Prevention
**Learning:** `Animated.loop` with `useNativeDriver: true` in React Native continues running on the native thread indefinitely even if conditions change, leading to resource leaks and orphaned animations.
**Action:** Always capture the animation reference and explicitly call `animation.stop()` in the `useEffect` cleanup function.
