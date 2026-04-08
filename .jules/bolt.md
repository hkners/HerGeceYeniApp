## 2025-04-08 - Unstopped Animated.loop Leaks on Native Thread
**Learning:** In React Native, `Animated.loop` with `useNativeDriver: true` continues running indefinitely on the native thread even if the component state changes, leading to resource/memory leaks if not explicitly stopped.
**Action:** Always capture the animation object returned by `Animated.loop(...)` and call `.stop()` in the `useEffect` cleanup function before starting a new animation or unmounting.
