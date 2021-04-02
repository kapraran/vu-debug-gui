import throttle from "lodash.throttle";

declare class WebUI {
  static Call: (cmd: string) => void;
}

export type EventPayload = {
  id: string;
  isClient: boolean;
  value?: any;
};

// make sure that the WebUI.Call will be available when
// creating the throttled version
let throttledCall: Function | undefined;
window.addEventListener(
  "load",
  () => (throttledCall = throttle(WebUI.Call, 10))
);

/**
 * Enables the keyboard
 */
export const enableKeyboard = () => {
  WebUI.Call("EnableKeyboard");
};

/**
 * Resets the keyboard
 */
export const resetKeyboard = () => {
  WebUI.Call("ResetKeyboard");
};

/**
 * Resets both the Mouse & keyboard
 */
export const resetMKB = () => {
  WebUI.Call("ResetMouse");
  WebUI.Call("ResetKeyboard");
};

/**
 * Dispatches an event to the lua client scripts
 *
 * @param eventName
 * @param payload
 */
export const dispatchEvent = (eventName: string, payload: EventPayload) => {
  if (throttledCall === undefined) return;
  throttledCall("DispatchEvent", eventName, JSON.stringify(payload));
};
