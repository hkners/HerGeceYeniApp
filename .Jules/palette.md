## 2024-05-24 - Accessibility for Custom Checkboxes
**Learning:** Custom interactive elements in React Native (like `TouchableOpacity` functioning as a checkbox) lack inherent semantic meaning for assistive technologies.
**Action:** Always explicitly declare `accessibilityRole`, `accessibilityState`, `accessibilityLabel`, and `accessibilityHint` on custom interactive components.