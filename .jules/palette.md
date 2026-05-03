## 2024-05-24 - Custom Toggle Accessibility
**Learning:** Custom interactive elements (like the intention toggles in App.js) built with TouchableOpacity lack native accessibility semantics, making them opaque to screen readers.
**Action:** Always include `accessibilityRole="checkbox"` and `accessibilityState={{ checked: <boolean> }}` when building custom toggle components to ensure proper screen reader support.
