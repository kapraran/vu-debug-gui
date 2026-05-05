export const DebugGUIControlType = {
  Button: 1,
  Checkbox: 2,
  Text: 3,
  Number: 4,
  Range: 5,
  Dropdown: 6,
  Vec2: 7,
  Vec3: 8,
  Vec4: 9,
} as const;

export type DebugGUIControlType = (typeof DebugGUIControlType)[keyof typeof DebugGUIControlType];

export default DebugGUIControlType;
