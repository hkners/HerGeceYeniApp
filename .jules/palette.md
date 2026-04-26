## 2024-05-24 - Missing accessibility states in custom toggles
**Learning:** Custom interactive elements (like the `BreathingContainer` functioning as a checkbox) in this app's React Native components often lack proper accessibility roles and states.
**Action:** Always ensure `TouchableOpacity` components acting as toggles include `accessibilityRole="checkbox"` and `accessibilityState={{ checked: isChecked }}` for proper screen reader support.
