## 2025-02-12 - Custom Checkbox Accessibility
**Learning:** React Native's TouchableOpacity doesn't default to any accessibility role. When using it to build custom checkboxes or toggles, always explicitly set `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` to ensure screen readers announce the current state correctly.
**Action:** Always add ARIA equivalents to interactive elements built with generic touchables.
