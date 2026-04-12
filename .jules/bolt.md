## 2025-04-12 - Prevent Animated.loop resource leak
**Learning:** In React Native, `Animated.loop` continues running indefinitely on the native thread (when `useNativeDriver: true`) even if the condition changes, potentially causing resource leaks.
**Action:** Always capture the animation reference and explicitly call `.stop()` in a cleanup function within `useEffect` when it is no longer needed.