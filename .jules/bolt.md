## 2024-04-20 - Orphaned Animations on Native Thread
**Learning:** In React Native, when using `Animated.loop` with `useNativeDriver: true`, the animation continues running indefinitely on the native thread even if the component unmounts or `useEffect` dependencies change. This creates a memory leak and performance bottleneck.
**Action:** Always capture the animation reference (e.g., `const anim = Animated.loop(...)`) and explicitly call `anim.stop()` in the `useEffect` cleanup function to prevent orphaned animations and resource leaks.
