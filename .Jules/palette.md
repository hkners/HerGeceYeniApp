## 2025-03-10 - Custom Interactive Accessibility
**Learning:** Custom interactive elements mimicking checkboxes (like TouchableOpacity) in React Native require explicit native accessibility features (`accessibilityRole`, `accessibilityState`, `accessibilityLabel`, etc.) to be properly announced by screen readers and properly reflect their state.
**Action:** Always add `accessibilityRole`, `accessibilityState`, `accessibilityLabel`, and `accessibilityHint` to interactive components that toggle state.
