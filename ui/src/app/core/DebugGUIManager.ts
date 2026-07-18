import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUIControl from "./DebugGUIControl";
import { Pane, FolderApi } from "./TweakpaneShim";

type GUI = Pane | FolderApi;

function toLowerCaseProps(obj: Record<string, any> | undefined) {
  if (!obj) return undefined;

  return Object.keys(obj).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = obj[key];
    return newObj;
  }, {} as Record<string, any>);
}

export default class DebugGUIManager {
  private gui: Pane;
  private controls: DebugGUIControl[];
  private folders: { [name: string]: GUI };
  private datObj: { [name: string]: any };
  private container: HTMLElement;

  constructor() {
    this.container = document.getElementById("tweakpane-container")!;

    this.gui = new Pane({
      title: "DebugGUI",
      container: this.container,
    });

    this.controls = [];
    this.folders = {};
    this.datObj = {};
  }

  resolveGUI(controlData: Record<string, any>) {
    let gui: GUI = this.gui;

    if (controlData.hasOwnProperty("Folder")) {
      if (!this.folders.hasOwnProperty(controlData.Folder)) {
        this.folders[controlData.Folder] = this.gui.addFolder({
          title: controlData.Folder,
        });
      }

      gui = this.folders[controlData.Folder];
    }

    return gui;
  }

  addButton(gui: GUI, control: DebugGUIControl) {
    gui
      .addButton({
        title: control.name,
      })
      .on("click", this.datObj[control.id]);
  }

  addCheckbox(gui: GUI, control: DebugGUIControl) {
    gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
      })
      .on("change", control.callback.bind(control));
  }

  addText(gui: GUI, control: DebugGUIControl) {
    gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
      })
      .on("change", control.callback.bind(control));
  }

  addNumber(gui: GUI, control: DebugGUIControl) {
    const opts = control.options as any;
    const params: Record<string, any> = {
      label: control.name,
    };

    if ('Min' in opts) params.min = opts.Min;
    if ('Max' in opts) params.max = opts.Max;
    if (opts.Step != null) params.step = opts.Step;

    gui
      .addBinding(this.datObj, control.id, params)
      .on("change", control.callback.bind(control));
  }

  addRange(gui: GUI, control: DebugGUIControl) {
    if (!('Min' in control.options)) {
      throw new Error('Range control requires Min option');
    }

    gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        min: control.options.Min,
        max: control.options.Max,
        step: control.options.Step,
        slider: true,
      })
      .on("change", control.callback.bind(control));
  }

  addDropdown(gui: GUI, control: DebugGUIControl) {
    if (!('Values' in control.options)) {
      throw new Error('Dropdown control requires Values option');
    }

    const options = control.options.Values.reduce((acc: Record<string, any>, curr: any) => {
      acc[curr] = curr;
      return acc;
    }, {} as Record<string, any>);

    gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        options,
      })
      .on("change", control.callback.bind(control));
  }

  addVector(gui: GUI, control: DebugGUIControl) {
    if (!('x' in control.options)) {
      throw new Error('Vector control requires x option');
    }

    const lowerCaseOpts: Record<string, any> = {
      label: control.name,
      x: toLowerCaseProps(control.options.x),
      y: toLowerCaseProps(control.options.y),
      z: toLowerCaseProps(control.options.z),
      w: toLowerCaseProps(control.options.w),
    };

    if (control.type === DebugGUIControlType.Vec2) {
      delete lowerCaseOpts.z;
      delete lowerCaseOpts.w;
    } else if (control.type === DebugGUIControlType.Vec3) {
      delete lowerCaseOpts.w;
    }

    gui
      .addBinding(this.datObj, control.id, lowerCaseOpts)
      .on("change", control.callback.bind(control));
  }

  addControl(controlData: Record<string, any>) {
    if (controlData.Id in this.datObj) return;

    const gui = this.resolveGUI(controlData);

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

  addControls(controlsData: Record<string, any>[]) {
    for (let control of controlsData) this.addControl(control);
  }

  isHidden() {
    return window.getComputedStyle(this.container, null).display === "none";
  }

  clearControls() {
    this.controls = [];
    this.folders = {};
    this.datObj = {};
    this.gui.dispose();
    this.gui = new Pane({
      title: "DebugGUI",
      container: this.container,
    });
  }

  showUI() {
    if (this.isHidden()) this.container.style.display = "flex";
  }

  hideUI() {
    if (!this.isHidden()) this.container.style.display = "none";
  }
}
