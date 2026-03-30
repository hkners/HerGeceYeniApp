## 2024-03-30 - Custom Checkbox Accessibility
**Learning:** In React Native, custom interactive elements acting as checkboxes (like TouchableOpacity toggling an intention) lack semantic meaning and must explicitly declare accessibilityRole, accessibilityState, and accessibilityLabel/accessibilityHint for assistive technologies.
**Action:** Always add explicit accessibility roles and states to custom interactive components that function as standard UI elements.
