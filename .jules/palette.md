## 2024-05-18 - Custom Toggle Accessibility
**Learning:** Custom interactive list items acting as toggles in this app lacked explicit role and state definitions, making them opaque to screen readers.
**Action:** Always apply `accessibilityRole="checkbox"` and `accessibilityState={{ checked: boolean }}` to custom interactive list items in React Native.