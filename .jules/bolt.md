## 2024-03-31 - Animated.loop Memory Leak
**Learning:** In React Native, `Animated.loop` continues running indefinitely on the native thread (when `useNativeDriver: true`) even if the component logically "completes" or its state changes, unless explicitly stopped. This can cause CPU/battery drain if the loop is merely overwritten or ignored rather than explicitly `.stop()`'d when a condition changes.
**Action:** Always capture the reference returned by `Animated.loop().start()` and ensure `.stop()` is called in the `useEffect` cleanup function or when the loop's condition becomes false.
