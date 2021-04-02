import dat, { GUI } from "dat.gui";
import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUIControl from "./DebugGUIControl";
import { enableKeyboard, resetKeyboard } from "./WebUI";

function attachInputListener() {
  Array.from(document.querySelectorAll("input")).forEach((el) => {
    el.addEventListener("focus", enableKeyboard);
    el.addEventListener("blur", resetKeyboard);
  });
}

export default class DebugGUIManager {
  private gui: GUI
  private controls: DebugGUIControl[]
  private folders: {[name: string]: GUI}
  private datObj: {[name: string]: any}

  constructor() {
    this.gui = new dat.GUI();
    this.gui.domElement.id = "dat-gui";

    this.controls = [];
    this.folders = {};
    this.datObj = {};
  }

  resolveGUI(controlData) {
    let gui = this.gui;

    if (controlData.hasOwnProperty("Folder")) {
      // create folder if it doesn't exists
      if (!this.folders.hasOwnProperty(controlData.Folder)) {
        this.folders[controlData.Folder] = this.gui.addFolder(
          controlData.Folder
        );
      }

      gui = this.folders[controlData.Folder];
    }

    return gui
  }

  addControl(controlData) {
    if (controlData.Id in this.datObj) return;

    if (this.controls.length === 0) this.gui.domElement.style.display = "block";

    const gui = this.resolveGUI(controlData)
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

    if (controlData.Type == DebugGUIControlType.Number) {
      gui
        .add(this.datObj, controlData.Id)
        .step(0.001)
        .name(controlData.Name)
        .onChange(control.callback.bind(control));

      attachInputListener();
    }

    if (controlData.Type == DebugGUIControlType.Range) {
      gui
        .add(
          this.datObj,
          controlData.Id,
          control.getOptions().Min,
          control.getOptions().Max,
          control.getOptions().Step
        )
        .name(controlData.Name)
        .onChange(control.callback.bind(control));

      attachInputListener();
    }

    if (controlData.Type == DebugGUIControlType.Dropdown) {
      gui
        .add(this.datObj, controlData.Id, control.getOptions().Values)
        .name(controlData.Name)
        .onChange(control.callback.bind(control));
    }
  }

  addControls(controlsData) {
    for (let control of controlsData) this.addControl(control);
  }
}
