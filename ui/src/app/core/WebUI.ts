declare class WebUI {
  static Call: (cmd: string) => void;
}

/* c8 ignore next 4 */
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).WebUI ??= { Call: (...args: unknown[]) => console.log("[WebUI.Call]", ...args) } as never;
}

export type EventPayload = {
  id: string;
  isClient: boolean;
  value?: unknown;
};

function throttle(fn: Function, delay: number) {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

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
