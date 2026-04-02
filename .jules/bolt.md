## 2025-02-14 - UI-thread animations with Reanimated
**What:** Migrated the "breathing" continuous loop animation from `Animated.loop` (React Native core) to `react-native-reanimated` (`useSharedValue` and `withRepeat`).
**Why:** The core `Animated` API, even with `useNativeDriver: true`, can still incur bridge overhead and synchronization issues during unmounting or state updates.
**Impact:** `react-native-reanimated` completely offloads the continuous scale calculations to the UI thread, freeing the JS thread for zero-lag business logic and eliminating React state re-renders, resulting in butter-smooth GPU-accelerated frame rates.
**Measurement:** Replaced `Animated.Value` with `useSharedValue` and `withRepeat`, verifying visually fluid looping at 60fps.