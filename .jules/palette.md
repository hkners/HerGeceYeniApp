## 2024-05-09 - Accessible Custom Checkboxes
**Learning:** When using custom interactive components like `TouchableOpacity` to act as toggles or checkboxes in React Native, always explicitly set `accessibilityRole="checkbox"` and `accessibilityState={{ checked: <boolean> }}` to ensure correct interpretation by screen readers.
**Action:** Always add appropriate accessibility attributes when building custom toggle controls.
