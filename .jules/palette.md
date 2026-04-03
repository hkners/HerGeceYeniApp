## 2024-04-03 - Added missing accessibility attributes to custom interactive element
**Learning:** Custom interactive elements in React Native (like `TouchableOpacity` acting as a checkbox) lack semantic meaning and must explicitly declare `accessibilityRole`, `accessibilityState`, and `accessibilityLabel` or `accessibilityHint` for assistive technologies to work correctly.
**Action:** When implementing custom toggle/checkbox components using generic touchable wrappers, always explicitly define the appropriate accessibility props to ensure screen readers can announce their state and purpose.
