## 2024-05-24 - Accessibility on TouchableOpacity as checkboxes
**Learning:** In React Native, custom interactive elements built with `TouchableOpacity` that act as checkboxes must have explicit `accessibilityRole="checkbox"` and `accessibilityState={{ checked: ... }}` so screen readers can correctly interpret and announce their state.
**Action:** Always add proper accessibility roles, states, labels, and hints to custom touchable components in React Native.
