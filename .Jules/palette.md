## 2024-07-25 - Custom Checkbox Accessibility
**Learning:** Custom interactive components mimicking checkboxes require explicit accessibility roles and states to be usable by screen readers.
**Action:** Always add `accessibilityRole="checkbox"` and `accessibilityState={{ checked: ... }}` to custom toggleable UI elements.
