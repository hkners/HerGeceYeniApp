## 2024-04-08 - Added Checkbox Accessibility to Interactive Views
**Learning:** Custom interactive elements (e.g., TouchableOpacity functioning as a checkbox) lack inherent semantic meaning and must explicitly declare accessibilityRole, accessibilityState, accessibilityLabel, and accessibilityHint for assistive technologies.
**Action:** Always verify custom toggles have the appropriate semantic roles and state labels when behaving as checkboxes.
