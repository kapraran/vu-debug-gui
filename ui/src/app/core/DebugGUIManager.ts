import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUIControl from "./DebugGUIControl";
import { Pane, FolderApi } from "./tweakpane-shim";
import type { InputBindingApi } from "./tweakpane-shim";
import type { ControlData } from "../types";

type GUI = Pane | FolderApi;

export default class DebugGUIManager {
  private gui: Pane;
  private controls: DebugGUIControl[];
  private folders: Record<string, GUI>;
  private datObj: Record<string, unknown>;
  private bindings: Map<string, InputBindingApi>;
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
    this.bindings = new Map();
  }

  resolveGUI(controlData: ControlData): GUI {
    let gui: GUI = this.gui;

    if ("Folder" in controlData && controlData.Folder != null) {
      if (!(controlData.Folder in this.folders)) {
        this.folders[controlData.Folder] = this.gui.addFolder({
          title: controlData.Folder,
        });
      }

      gui = this.folders[controlData.Folder];
    }

    return gui;
  }

  addButton(gui: GUI, control: DebugGUIControl): void {
    gui
      .addButton({
        title: control.name,
      })
      .on("click", () => control.callback({}));
  }

  addCheckbox(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
      })
      .on("change", control.callback.bind(control));
    this.bindings.set(control.id, binding);
  }

  addText(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
      })
      .on("change", control.callback.bind(control));
    this.bindings.set(control.id, binding);
  }

  addNumber(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        min: control.min,
        max: control.max,
        step: control.step,
      })
      .on("change", control.callback.bind(control));
    this.bindings.set(control.id, binding);
  }

  addRange(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        min: control.min ?? 0,
        max: control.max ?? 100,
        step: control.step ?? 1,
        slider: true,
      })
      .on("change", control.callback.bind(control));
    this.bindings.set(control.id, binding);
  }

  addDropdown(gui: GUI, control: DebugGUIControl): void {
    const options = Array.isArray(control.values)
      ? Object.fromEntries(control.values.map((v) => [String(v), v]))
      : (control.values as Record<string, unknown>) ?? {};

    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        options,
      })
      .on("change", control.callback.bind(control));
    this.bindings.set(control.id, binding);
  }

  addVector(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        ...control.axes,
      })
      .on("change", control.callback.bind(control));
    this.bindings.set(control.id, binding);
  }

  addControl(controlData: ControlData): void {
    if (controlData.Id in this.datObj) return;

    const gui = this.resolveGUI(controlData);

    const control = new DebugGUIControl(controlData);
    this.controls.push(control);
    this.datObj[control.id] = control.createObjValue();

    const type = controlData.Type;

    if (type === DebugGUIControlType.Button) this.addButton(gui, control);
    else if (type === DebugGUIControlType.Checkbox) this.addCheckbox(gui, control);
    else if (type === DebugGUIControlType.Text) this.addText(gui, control);
    else if (type === DebugGUIControlType.Number) this.addNumber(gui, control);
    else if (type === DebugGUIControlType.Range) this.addRange(gui, control);
    else if (type === DebugGUIControlType.Dropdown) this.addDropdown(gui, control);
    else if (type === DebugGUIControlType.Vec2 || type === DebugGUIControlType.Vec3 || type === DebugGUIControlType.Vec4) this.addVector(gui, control);
  }

  addControls(controlsData: ControlData[]): void {
    for (const control of controlsData) this.addControl(control);
  }

  isHidden(): boolean {
    return window.getComputedStyle(this.container, null).display === "none";
  }

  setControlValue(data: { id: string; value: unknown }): void {
    const binding = this.bindings.get(data.id);
    if (!binding) return;
    binding.setValue(data.value);
  }

  clearControls(): void {
    this.controls = [];
    this.folders = {};
    this.datObj = {};
    this.bindings = new Map();
    this.gui.dispose();
    this.gui = new Pane({
      title: "DebugGUI",
      container: this.container,
    });
  }

  showUI(): void {
    if (this.isHidden()) this.container.style.display = "flex";
  }

  hideUI(): void {
    if (!this.isHidden()) this.container.style.display = "none";
  }
}
