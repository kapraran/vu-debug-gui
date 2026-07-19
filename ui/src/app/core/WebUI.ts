declare class WebUI {
  static Call: (cmd: string, ...args: string[]) => void;
}

if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).WebUI ??= { Call: (...args: unknown[]) => console.log("[WebUI.Call]", ...args) };
}

export type EventPayload = {
  id: string;
  isClient: boolean;
  value?: unknown;
};

function throttle(fn: (...args: string[]) => void, delay: number) {
  let lastCall = 0;
  return function (...args: string[]) {
    const now = performance.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

let throttledCall: ((...args: string[]) => void) | undefined;
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
