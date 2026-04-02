## 2024-05-24 - Accessibility for Custom Toggles
**Learning:** In React Native, custom interactive elements (e.g., `TouchableOpacity` functioning as a checkbox) lack inherent semantic meaning. They must explicitly declare `accessibilityRole`, `accessibilityState`, and `accessibilityLabel` or `accessibilityHint` for assistive technologies to interpret them correctly.
**Action:** When creating custom toggles or checkboxes, always add `accessibilityRole="checkbox"`, update `accessibilityState={{ checked: ... }}`, and provide meaningful `accessibilityLabel` and `accessibilityHint` props.
