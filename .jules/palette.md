## 2024-05-23 - Accessibility Roles on Custom Checkboxes
**Learning:** Custom interactive elements (like `TouchableOpacity` acting as checkboxes) in React Native lack semantic meaning and require explicit `accessibilityRole`, `accessibilityState`, and `accessibilityLabel`/`accessibilityHint` for assistive technologies to function correctly.
**Action:** Always verify custom toggles and buttons have appropriate accessibility properties.
