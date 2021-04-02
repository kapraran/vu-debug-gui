import { GUI } from "dat.gui";
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
  private gui: GUI;
  private controls: DebugGUIControl[];
  private folders: { [name: string]: GUI };
  private datObj: { [name: string]: any };

  constructor() {
    this.gui = new GUI();
    this.gui.domElement.id = "dat-gui";

    this.controls = [];
    this.folders = {};
    this.datObj = {};
  }

  /**
   *
   * @param controlData
   * @returns
   */
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

    return gui;
  }

  /**
   *
   * @param gui
   * @param control
   */
  addButton(gui: GUI, control: DebugGUIControl) {
    gui.add(this.datObj, control.id).name(control.name);
  }

  /**
   *
   * @param gui
   * @param control
   */
  addCheckbox(gui: GUI, control: DebugGUIControl) {
    gui
      .add(this.datObj, control.id)
      .name(control.name)
      .onChange(control.callback.bind(control));
  }

  /**
   *
   * @param gui
   * @param control
   */
  addText(gui: GUI, control: DebugGUIControl) {
    gui
      .add(this.datObj, control.id)
      .name(control.name)
      .onChange(control.callback.bind(control));

    attachInputListener();
  }

  /**
   *
   * @param gui
   * @param control
   */
  addNumber(gui: GUI, control: DebugGUIControl) {
    gui
      .add(this.datObj, control.id)
      .step(0.001)
      .name(control.name)
      .onChange(control.callback.bind(control));

    attachInputListener();
  }

  /**
   *
   * @param gui
   * @param control
   */
  addRange(gui: GUI, control: DebugGUIControl) {
    gui
      .add(
        this.datObj,
        control.id,
        control.options.Min,
        control.options.Max,
        control.options.Step
      )
      .name(control.name)
      .onChange(control.callback.bind(control));

    attachInputListener();
  }

  /**
   *
   * @param gui
   * @param control
   */
  addDropdown(gui: GUI, control: DebugGUIControl) {
    gui
      .add(this.datObj, control.id, control.options.Values)
      .name(control.name)
      .onChange(control.callback.bind(control));
  }

  /**
   *
   * @param controlData
   * @returns
   */
  addControl(controlData) {
    // check if this control already exists
    if (controlData.Id in this.datObj) return;

    // show dat.gui controls
    if (this.controls.length === 0) this.gui.domElement.style.display = "block";

    const gui = this.resolveGUI(controlData);

    // create control
    const control = new DebugGUIControl(controlData);
    this.controls.push(control);
    this.datObj[control.id] = control.createObjValue();

    if (controlData.Type === DebugGUIControlType.Button)
      this.addButton(gui, control);
    else if (controlData.Type === DebugGUIControlType.Checkbox)
      this.addCheckbox(gui, control);
    else if (controlData.Type === DebugGUIControlType.Text)
      this.addText(gui, control);
    else if (controlData.Type == DebugGUIControlType.Number)
      this.addNumber(gui, control);
    else if (controlData.Type == DebugGUIControlType.Range)
      this.addRange(gui, control);
    else if (controlData.Type == DebugGUIControlType.Dropdown)
      this.addDropdown(gui, control);
  }

  /**
   *
   * @param controlsData
   */
  addControls(controlsData) {
    for (let control of controlsData) this.addControl(control);
  }
}
