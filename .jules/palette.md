## 2024-05-06 - React Native Custom Checkboxes
**Learning:** Custom interactive elements in React Native (like `TouchableOpacity` acting as toggles) require explicit accessibility roles and states to be interpreted correctly by screen readers.
**Action:** Always include `accessibilityRole="checkbox"` and `accessibilityState={{ checked: <boolean> }}` on custom toggle components.