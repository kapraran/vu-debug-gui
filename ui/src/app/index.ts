import DebugGUIManager from "./core/DebugGUIManager";

declare global {
  interface Window { vext: {
    addControls: Function;
  }; }
}

const manager = new DebugGUIManager();

const vext = {
  addControls: manager.addControls.bind(manager),
};

window.vext = vext;

// TODO Remove it until i add a config option about it
// document.body.addEventListener("click", (ev) => {
//   if (ev.target !== document.body) return;
//   resetMKB();

//   if (!throttledCall) return;
//   throttledCall("DispatchEvent", DebugGUICustomEvent.ResetMKB);
// });
