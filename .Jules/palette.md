## 2024-05-18 - Accessibility Roles for Custom Checkboxes
**Learning:** In React Native, custom interactive elements (like `TouchableOpacity` mimicking a checkbox) must explicitly declare native accessibility features by including `accessibilityRole`, `accessibilityState={{ checked: ... }}`, and an `accessibilityLabel` or `accessibilityHint` to be properly interpreted by screen readers.
**Action:** Always verify that custom UI elements performing standard roles (e.g., toggles, checkboxes) are equipped with the corresponding native accessibility attributes.
