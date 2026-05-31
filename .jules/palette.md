## 2026-05-31 - Intentions List Toggle Accessibility
**Learning:** Custom toggle components built with `TouchableOpacity` require explicit ARIA-equivalent props for screen readers, unlike standard checkboxes.
**Action:** Always include `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` when creating custom toggle/checkbox components.
