import DebugGUIManager from "./core/DebugGUIManager";
import type { VeExt } from "./types";

declare global {
  interface Window { vext: VeExt; }
}

const manager = new DebugGUIManager();

const vext = {
  addControls: manager.addControls.bind(manager),
  clearControls: manager.clearControls.bind(manager),
  showUI: manager.showUI.bind(manager),
  hideUI: manager.hideUI.bind(manager),
  setControlValue: manager.setControlValue.bind(manager),
  setControlVisible: manager.setControlVisible.bind(manager),
  setControlDisabled: manager.setControlDisabled.bind(manager),
};

window.vext = vext;

// TODO Remove it until i add a config option about it
// document.body.addEventListener("click", (ev) => {
//   if (ev.target !== document.body) return;
//   resetMKB();

//   if (!throttledCall) return;
//   throttledCall("DispatchEvent", DebugGUICustomEvent.ResetMKB);
// });
