## 2024-05-24 - Accessibility for Custom Checkboxes in React Native
**Learning:** Custom interactive elements (e.g., `TouchableOpacity` functioning as a checkbox) lack inherent semantic meaning and must explicitly declare `accessibilityRole`, `accessibilityState`, and `accessibilityLabel` or `accessibilityHint` for assistive technologies to work correctly.
**Action:** Always add `accessibilityRole="checkbox"`, `accessibilityState={{ checked: ... }}`, and descriptive `accessibilityLabel` to custom checkbox elements.
