export const enableKeyboard = () => {
  WebUI.Call("EnableKeyboard");
};

export const resetKeyboard = () => {
  WebUI.Call("ResetKeyboard");
};

export const resetMKB = () => {
  WebUI.Call("ResetMouse");
  WebUI.Call("ResetKeyboard");
};
