## 2024-05-24 - Custom Checkbox Accessibility
**Learning:** Custom interactive elements like `TouchableOpacity` functioning as checkboxes lack inherent semantic meaning in this app and must explicitly declare `accessibilityRole`, `accessibilityState`, and `accessibilityLabel`/`accessibilityHint` for assistive technologies to work correctly.
**Action:** Always add explicit accessibility properties to custom interactive components that behave like standard HTML controls.
