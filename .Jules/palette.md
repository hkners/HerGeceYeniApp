## 2026-03-08 - Accessible Custom Checkboxes in React Native
**Learning:** Custom interactive elements that behave like checkboxes (e.g., TouchableOpacity wrapping text) require explicit native accessibility features for screen readers to interpret them correctly. Relying solely on visual cues or generic "button" roles is insufficient.
**Action:** Always include `accessibilityRole="checkbox"`, `accessibilityState={{ checked: isChecked }}`, and descriptive `accessibilityLabel`/`accessibilityHint` props when building custom toggleable components in React Native.
