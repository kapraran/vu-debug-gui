export const DebugGUICustomEvent = {
  UIEvent: "DBGUI:UIEvent",
  ResetMKB: "DBGUI:ResetMKB",
} as const;

export type DebugGUICustomEvent = (typeof DebugGUICustomEvent)[keyof typeof DebugGUICustomEvent];

export default DebugGUICustomEvent;
