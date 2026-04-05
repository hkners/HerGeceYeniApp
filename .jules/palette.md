## 2024-04-05 - Custom Checkbox Accessibility in React Native
**Learning:** Custom interactive elements (like `TouchableOpacity` functioning as a checkbox) lack inherent semantic meaning and must explicitly declare `accessibilityRole="checkbox"`, `accessibilityState={{ checked: ... }}`, and `accessibilityLabel` for assistive technologies to work correctly.
**Action:** Always add explicit accessibility roles, states, and labels to custom interactive elements.
