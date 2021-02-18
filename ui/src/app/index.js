import dat from "dat.gui";
import { enableKeyboard, resetKeyboard, resetMKB } from "./utils";
import { DebugGUIControlType, DebugGUICustomEvents } from "./enums";

function attachInputListener() {
  Array.from(document.querySelectorAll("input")).forEach((el) => {
    el.addEventListener("focus", enableKeyboard);
    el.addEventListener("blur", resetKeyboard);
  });
}

class DebugGUIControl {
  constructor(controlData) {
    this.id = controlData.Id;
    this.type = controlData.Type;
    this.name = controlData.Name;
    this.options = controlData.Options;
    this.isClient = controlData.IsClient;
  }

  callback(value) {
    console.log(`DebugGUIControl: ${this.id} was clicked`);

    const payload = {
      id: this.id,
      isClient: this.isClient,
    };

    if (value !== undefined) payload.value = value;

    WebUI.Call(
      "DispatchEvent",
      DebugGUICustomEvents.UIEvent,
      JSON.stringify(payload)
    );
  }

  createObjValue() {
    if (this.type === DebugGUIControlType.Button)
      return this.callback.bind(this);

    return this.options.DefValue;
  }
}

class DebugGUIManager {
  constructor() {
    this.gui = new dat.GUI();
    this.gui.domElement.id = "dat-gui";

    this.controls = [];
    this.datObj = {};
  }

  addControl(controlData) {
    const control = new DebugGUIControl(controlData);
    this.controls.push(control);
    this.datObj[controlData.Name] = control.createObjValue();

    if (controlData.Type == DebugGUIControlType.Button) {
      this.gui.add(this.datObj, controlData.Name);
    }

    if (controlData.Type == DebugGUIControlType.Range) {
      this.gui
        .add(
          this.datObj,
          controlData.Name,
          control.options.Min,
          control.options.Max,
          control.options.Step
        )
        .onChange(control.callback.bind(control));

      attachInputListener();
    }
  }

  addControls(controlsData) {
    for (let control of controlsData) this.addControl(control);
  }
}

const manager = new DebugGUIManager();

window.vext = {
  addControls: manager.addControls.bind(manager),
};

document.body.addEventListener("click", (ev) => {
  if (ev.target !== document.body) return;
  resetMKB();
  WebUI.Call('DispatchEvent', DebugGUICustomEvents.ResetMKB)
});
