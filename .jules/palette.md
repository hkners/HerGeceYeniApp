## 2024-05-24 - Accessibility on Custom Interactive Elements
**Learning:** In React Native, custom interactive elements (e.g., `TouchableOpacity` functioning as a checkbox) lack inherent semantic meaning and must explicitly declare `accessibilityRole`, `accessibilityState`, and `accessibilityLabel`/`accessibilityHint` for assistive technologies.
**Action:** Always add semantic accessibility attributes to custom components like `TouchableOpacity` or `Pressable` that function as standard UI controls.
