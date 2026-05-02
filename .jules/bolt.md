## 2024-05-15 - React Native Animation Leaks & List Performance
**Learning:** `Animated.loop` with `useNativeDriver: true` leaks onto the native thread if not explicitly stopped on unmount or dependency change. Furthermore, lists mapping state updates without `React.memo` and `useCallback` cause O(N) re-renders for every single item interaction.
**Action:** Always capture the `Animated.loop` instance and call `.stop()` in the cleanup function. Always wrap list items in `React.memo` and their interaction handlers in `useCallback` to ensure only the updated item re-renders.
