## 2024-04-10 - Explicit Accessibility for Custom Interactive Elements
**Learning:** In React Native Web, custom interactive components like `TouchableOpacity` functioning as list toggles lack inherent semantic meaning and do not automatically expose state to screen readers.
**Action:** Always explicitly declare `accessibilityRole="checkbox"`, `accessibilityState={{ checked: ... }}`, and appropriate labels/hints to ensure screen reader compatibility.
