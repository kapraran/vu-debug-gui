import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUIControl from "./DebugGUIControl";
import { enableKeyboard, resetKeyboard } from "./WebUI";
import {Pane, FolderApi} from 'tweakpane'

type GUI = Pane | FolderApi

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
    // this.gui.domElement.id = "dat-gui";

    this.gui = new Pane({
      container: document.getElementById('tweakpane-container')
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
        this.folders[controlData.Folder] = this.gui.addFolder(
          {
            title: controlData.Folder
          }
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
    gui.addButton({
      title: control.name
    }).on('click', this.datObj[control.id])
  }

  /**
   *
   * @param gui
   * @param control
   */
  addCheckbox(gui: GUI, control: DebugGUIControl) {
    gui
      .addInput(this.datObj, control.id, {
        label: control.name
      })
      .on('change', control.callback.bind(control));
  }

  /**
   *
   * @param gui
   * @param control
   */
  addText(gui: GUI, control: DebugGUIControl) {
    gui
      .addInput(this.datObj, control.id, {
        label: control.name
      })
      .on('change', control.callback.bind(control));

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
        label: control.name
      })
      .on('change', control.callback.bind(control));

    attachInputListener();
  }

  /**
   *
   * @param gui
   * @param control
   */
  addRange(gui: GUI, control: DebugGUIControl) {
    gui
      .addInput(this.datObj, control.id, {
        label: control.name,
        min: control.options.Min,
        max: control.options.Max,
        step: control.options.Step
      })
      .on('change', control.callback.bind(control));

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
      acc[curr] = curr
      return acc
    }, {})

    gui
      .addInput(this.datObj, control.id, {
        label: control.name,
        options
      })
      .on('change', control.callback.bind(control));
  }

  addVec2D(gui: GUI, control: DebugGUIControl) {
    gui
      .addInput(this.datObj, control.id, {
        label: control.name
      })
      .on('change', control.callback.bind(control));

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
    // if (this.controls.length === 0) this.gui.domElement.style.display = "block";
    if (this.controls.length !== 0) document.getElementById('tweakpane-container').style.display = 'block'

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
    else if (controlData.Type == DebugGUIControlType.Vec2D)
      this.addVec2D(gui, control);
  }

  /**
   *
   * @param controlsData
   */
  addControls(controlsData) {
    for (let control of controlsData) this.addControl(control);
  }
}
