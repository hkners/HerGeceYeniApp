## 2024-03-31 - Explicit Accessibility Props for Custom Interactive Elements
**Learning:** In React Native, custom interactive elements (e.g., `TouchableOpacity` functioning as a checkbox or toggle) lack inherent semantic meaning and must explicitly declare `accessibilityRole`, `accessibilityState`, and `accessibilityLabel`/`accessibilityHint` to be properly interpreted by assistive technologies.
**Action:** Always add explicit accessibility props to `TouchableOpacity` when it acts as a semantic control (like a checkbox or toggle button).
