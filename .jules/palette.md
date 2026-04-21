## 2024-04-21 - Custom Checkbox Accessibility
**Learning:** Custom interactive elements built with `TouchableOpacity` that toggle state in this app are missing necessary screen reader context, making it impossible for visually impaired users to know their current state.
**Action:** Always add `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` to `TouchableOpacity` components that function as toggles.
