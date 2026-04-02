## 2024-10-24 - Custom Checkbox Accessibility
**Learning:** In React Native, custom interactive elements (e.g., `TouchableOpacity` functioning as a checkbox) lack inherent semantic meaning and must explicitly declare `accessibilityRole`, `accessibilityState`, and `accessibilityLabel` or `accessibilityHint` for assistive technologies to work correctly.
**Action:** Always add explicit semantic accessibility attributes to custom toggle components.
