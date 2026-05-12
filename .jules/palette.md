## 2025-02-14 - Custom Toggle Accessibility
**Learning:** Custom toggle components like intentions acting as checkboxes need explicit roles and states for screen readers, as `TouchableOpacity` defaults to a generic button role without checked states.
**Action:** Always add `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` when implementing custom toggles.