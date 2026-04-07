## 2024-10-24 - Animated.loop Resource Leak
**Learning:** In React Native, Animated.loop continues running indefinitely on the native thread (when useNativeDriver: true) even if the condition changes, potentially causing resource leaks.
**Action:** Always capture the animation reference and explicitly call .stop() in a cleanup function when it is no longer needed.