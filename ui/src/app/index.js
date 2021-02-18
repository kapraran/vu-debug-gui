import dat from "dat.gui";
import { enableKeyboard, resetKeyboard, resetMKB } from "./utils";
import { DebugGUIControlType, DebugGUICustomEvents } from "./enums";

const printArea = document.querySelector("#print-area");

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

    if (this.type === DebugGUIControlType.Text)
      return this.options.DefValue.toString();

    return this.options.DefValue;
  }
}

class DebugGUIManager {
  constructor() {
    this.gui = new dat.GUI();
    this.gui.domElement.id = "dat-gui";

    this.controls = [];
    this.folders = {};
    this.datObj = {};
  }

  addControl(controlData) {
    if (controlData.Id in this.datObj) return;

    let gui = this.gui;

    if (controlData.hasOwnProperty("Folder")) {
      if (!this.folders.hasOwnProperty(controlData.Folder)) {
        this.folders[controlData.Folder] = this.gui.addFolder(
          controlData.Folder
        );
      }

      gui = this.folders[controlData.Folder];
    }

    const control = new DebugGUIControl(controlData);
    this.controls.push(control);
    this.datObj[controlData.Id] = control.createObjValue();

    if (controlData.Type == DebugGUIControlType.Button) {
      gui.add(this.datObj, controlData.Id).name(controlData.Name);
    }

    if (controlData.Type == DebugGUIControlType.Checkbox) {
      gui
        .add(this.datObj, controlData.Id)
        .name(controlData.Name)
        .onChange(control.callback.bind(control));
    }

    if (controlData.Type == DebugGUIControlType.Text) {
      gui
        .add(this.datObj, controlData.Id)
        .name(controlData.Name)
        .onChange(control.callback.bind(control));

      attachInputListener();
    }

    if (controlData.Type == DebugGUIControlType.Range) {
      gui
        .add(
          this.datObj,
          controlData.Id,
          control.options.Min,
          control.options.Max,
          control.options.Step
        )
        .name(controlData.Name)
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
  WebUI.Call("DispatchEvent", DebugGUICustomEvents.ResetMKB);
});

// const str = JSON.stringify({
//   Position: [1, 2, 3],
//   Alive: false
// }, null, 2)
// printArea.innerHTML = str.substr(1, str.length - 2).trim();

// manager.addControls([
//   {
//     Id: '123123123',
//     Name: 'Hello',
//     Options: {
//       DefValue: true
//     },
//     Type: 2,
//   },
//   {
//     Id: '12352ada',
//     Name: 'Nope',
//     Options: {
//       DefValue: 'Hello Man'
//     },
//     Type: 3
//   }
// ])
