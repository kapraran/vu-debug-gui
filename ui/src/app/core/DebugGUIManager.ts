import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUIControl, { ControlOptionsType, VectorOptionsType } from "./DebugGUIControl";
import { enableKeyboard, resetKeyboard } from "./WebUI";
import { Pane, FolderApi } from "tweakpane";

type GUI = Pane | FolderApi;

function attachInputListener() {
  Array.from(document.querySelectorAll("input")).forEach((el) => {
    el.addEventListener("focus", enableKeyboard);
    el.addEventListener("blur", resetKeyboard);
  });
}

function toLowerCaseProps(obj: Record<string, any>) {
  if (!obj) return undefined;

  return Object.keys(obj).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = obj[key];
    return newObj;
  }, {});
}

export default class DebugGUIManager {
  private gui: GUI;
  private controls: DebugGUIControl[];
  private folders: { [name: string]: GUI };
  private datObj: { [name: string]: any };

  constructor() {
    // this.gui.domElement.id = "dat-gui";

    this.gui = new Pane({
      container: document.getElementById("tweakpane-container"),
    });

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
        this.folders[controlData.Folder] = this.gui.addFolder({
          title: controlData.Folder,
        });
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
    gui
      .addButton({
        title: control.name,
      })
      .on("click", this.datObj[control.id]);
  }

  /**
   *
   * @param gui
   * @param control
   */
  addCheckbox(gui: GUI, control: DebugGUIControl) {
    gui
      .addInput(this.datObj, control.id, {
        label: control.name,
      })
      .on("change", control.callback.bind(control));
  }

  /**
   *
   * @param gui
   * @param control
   */
  addText(gui: GUI, control: DebugGUIControl) {
    gui
      .addInput(this.datObj, control.id, {
        label: control.name,
      })
      .on("change", control.callback.bind(control));

    attachInputListener();
  }

  /**
   *
   * @param gui
   * @param control
   */
  addNumber(gui: GUI, control: DebugGUIControl) {
    gui
      .addInput(this.datObj, control.id, {
        label: control.name,
      })
      .on("change", control.callback.bind(control));

    attachInputListener();
  }

  /**
   *
   * @param gui
   * @param control
   */
  addRange(gui: GUI, control: DebugGUIControl) {
    const options = control.options as ControlOptionsType

    gui
      .addInput(this.datObj, control.id, {
        label: control.name,
        min: options.Min,
        max: options.Max,
        step: options.Step,
      })
      .on("change", control.callback.bind(control));

    attachInputListener();
  }

  /**
   *
   * @param gui
   * @param control
   */
  addDropdown(gui: GUI, control: DebugGUIControl) {
    // convert array to map
    const options = control.options.Values.reduce((acc, curr) => {
      acc[curr] = curr;
      return acc;
    }, {});

    gui
      .addInput(this.datObj, control.id, {
        label: control.name,
        options,
      })
      .on("change", control.callback.bind(control));
  }

  addVector(gui: GUI, control: DebugGUIControl) {
    const options = control.options as VectorOptionsType;

    const lowerCaseOpts = {
      label: control.name,
      x: toLowerCaseProps(options["x"]),
      y: toLowerCaseProps(options["y"]),
      z: toLowerCaseProps(options["z"]),
      w: toLowerCaseProps(options["w"]),
    };

    console.log(lowerCaseOpts)

    gui
      .addInput(this.datObj, control.id, lowerCaseOpts)
      .on("change", control.callback.bind(control));

    attachInputListener();
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
    // if (this.controls.length === 0) this.gui.domElement.style.display = "flex";
    if (this.controls.length !== 0)
      document.getElementById("tweakpane-container").style.display = "flex";

    const gui = this.resolveGUI(controlData);

    // create control
    const control = new DebugGUIControl(controlData);
    this.controls.push(control);
    this.datObj[control.id] = control.createObjValue();

    const type = controlData.Type;

    if (type === DebugGUIControlType.Button) this.addButton(gui, control);
    else if (type === DebugGUIControlType.Checkbox)
      this.addCheckbox(gui, control);
    else if (type === DebugGUIControlType.Text) this.addText(gui, control);
    else if (type == DebugGUIControlType.Number) this.addNumber(gui, control);
    else if (type == DebugGUIControlType.Range) this.addRange(gui, control);
    else if (type == DebugGUIControlType.Dropdown)
      this.addDropdown(gui, control);
    else if (
      [
        DebugGUIControlType.Vec2,
        DebugGUIControlType.Vec3,
        DebugGUIControlType.Vec4,
      ].includes(type)
    )
      this.addVector(gui, control);
  }

  /**
   *
   * @param controlsData
   */
  addControls(controlsData) {
    for (let control of controlsData) this.addControl(control);
  }
}
