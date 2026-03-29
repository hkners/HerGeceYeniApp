## 2024-05-24 - Custom Interactive Elements Lack Semantics
**Learning:** In React Native, custom interactive elements (like `TouchableOpacity` functioning as a checkbox) lack inherent semantic meaning and are not properly recognized by assistive technologies without explicit attributes.
**Action:** Always declare `accessibilityRole`, `accessibilityState`, and `accessibilityLabel`/`accessibilityHint` on custom interactive components like `TouchableOpacity` to ensure they are accessible.
