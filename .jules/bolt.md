## 2026-04-28 - Animated.loop Memory Leaks in React Native
**Learning:** Using `Animated.loop` inside a `useEffect` with `useNativeDriver: true` can leak resources because the animation continues indefinitely on the native thread even when the component unmounts.
**Action:** Always capture the animation reference (e.g. `let animation = Animated.loop(...); animation.start();`) and explicitly call `animation.stop()` in the `useEffect` cleanup function to prevent orphaned animations.
