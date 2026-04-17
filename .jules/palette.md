## 2024-04-17 - Accessible Custom Checkboxes
**Learning:** When using `TouchableOpacity` to create custom toggleable list items, screen readers do not automatically know the item is interactive or what its current state is.
**Action:** Always add `accessibilityRole="checkbox"` and `accessibilityState={{ checked: <boolean> }}` to custom interactive components that function as toggles.
