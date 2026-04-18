## 2026-04-18 - Custom Toggle Accessibility
**Learning:** Custom interactive elements (like the `BreathingContainer` intentions list) functioning as checkboxes/toggles lacked proper accessibility roles and state, making them invisible as toggles to screen readers.
**Action:** Always include `accessibilityRole="checkbox"` and `accessibilityState={{ checked: <boolean> }}` on custom toggles using `TouchableOpacity` or `Pressable`.
