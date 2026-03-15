## 2024-05-18 - Prevent Memory Leaks from Animated.loop in React Native

**Learning:** I noticed that using `Animated.loop` in a `useEffect` hook without capturing its reference and calling `.stop()` on component unmount or state change creates a background memory leak, as the animation thread continues running indefinitely.

**Action:** Always assign `Animated.loop` to a variable inside `useEffect` and return a cleanup function that checks if the animation is truthy before calling `.stop()` on it.