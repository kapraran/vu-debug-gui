import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUIControl from "./DebugGUIControl";
import { Pane, FolderApi, TabApi, RowApi } from "./tweakpane-shim";
import type { InputBindingApi, ButtonApi } from "./tweakpane-shim";
import type { ControlData, PanelData, ContainerSegment } from "../types";

type GUI = Pane | FolderApi | TabApi | RowApi;

export default class DebugGUIManager {
  private gui: Pane;
  private controls: DebugGUIControl[];
  private containers: Record<string, GUI>;
  private panes: Record<string, Pane>;
  private datObj: Record<string, unknown>;
  private bindings: Map<string, InputBindingApi>;
  private buttons: Map<string, ButtonApi>;
  private container: HTMLElement;

  constructor() {
    this.container = document.getElementById("tweakpane-container")!;

    this.gui = new Pane({
      title: "DebugGUI",
      container: this.container,
    });

    this.controls = [];
    this.containers = {};
    this.panes = {};
    this.datObj = {};
    this.bindings = new Map();
    this.buttons = new Map();
  }

  resolveGUI(path: ContainerSegment[] | null | undefined): GUI {
    if (!path || path.length === 0) return this.gui;

    let gui: GUI = this.gui;
    let currentKey = "";

    for (let i = 0; i < path.length; i++) {
      const seg = path[i];

      if (seg.type === "panel") {
        currentKey = "panel:" + seg.name;
        if (!(currentKey in this.containers)) {
          const pane = this.panes[seg.name] ?? this.gui;
          this.containers[currentKey] = pane;
        }
        gui = this.containers[currentKey];
        continue;
      }

      if (seg.type === "tab") {
        currentKey = currentKey ? currentKey + "/tab" : "tab";
        if (!(currentKey in this.containers)) {
          this.containers[currentKey] = gui.addTab({ title: seg.name });
        } else {
          (this.containers[currentKey] as TabApi).switchTab(seg.name);
        }
        gui = this.containers[currentKey];
        continue;
      }

      currentKey = currentKey
        ? currentKey + "/" + seg.type + ":" + seg.name
        : seg.type + ":" + seg.name;

      if (!(currentKey in this.containers)) {
        if (seg.type === "row") {
          this.containers[currentKey] = gui.addRow({ title: seg.title });
        } else {
          this.containers[currentKey] = gui.addFolder({ title: seg.name });
        }
      }
      gui = this.containers[currentKey];
    }

    return gui;
  }

  addButton(gui: GUI, control: DebugGUIControl): void {
    const btn = gui
      .addButton({
        title: control.name,
        tooltip: control.tooltip,
        icon: control.icon,
      })
      .on("click", () => control.callback({}));
    if (!control.visible) btn.hide();
    if (control.disabled) btn.disable();
    this.buttons.set(control.id, btn);
  }

  addCheckbox(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        tooltip: control.tooltip,
      })
      .on("change", control.callback.bind(control));
    if (!control.visible) binding.hide();
    if (control.disabled) binding.disable();
    this.bindings.set(control.id, binding);
  }

  addText(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        tooltip: control.tooltip,
      })
      .on("change", control.callback.bind(control));
    if (!control.visible) binding.hide();
    if (control.disabled) binding.disable();
    this.bindings.set(control.id, binding);
  }

  addNumber(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        min: control.min,
        max: control.max,
        step: control.step,
        format: control.format,
        tooltip: control.tooltip,
      })
      .on("change", control.callback.bind(control));
    if (!control.visible) binding.hide();
    if (control.disabled) binding.disable();
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
        format: control.format,
        tooltip: control.tooltip,
      })
      .on("change", control.callback.bind(control));
    if (!control.visible) binding.hide();
    if (control.disabled) binding.disable();
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
        tooltip: control.tooltip,
      })
      .on("change", control.callback.bind(control));
    if (!control.visible) binding.hide();
    if (control.disabled) binding.disable();
    this.bindings.set(control.id, binding);
  }

  addVector(gui: GUI, control: DebugGUIControl): void {
    const binding = gui
      .addBinding(this.datObj, control.id, {
        label: control.name,
        ...control.axes,
        tooltip: control.tooltip,
      })
      .on("change", control.callback.bind(control));
    if (!control.visible) binding.hide();
    if (control.disabled) binding.disable();
    this.bindings.set(control.id, binding);
  }

  addControl(controlData: ControlData): void {
    if (controlData.Id in this.datObj) return;

    const gui = this.resolveGUI(controlData.Path);

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

  addPanels(panels: Record<string, PanelData>): void {
    for (const [name, data] of Object.entries(panels)) {
      if (name in this.panes) continue;
      this.panes[name] = new Pane({
        title: name,
        container: document.body,
        position: data.position ?? "bottom-left",
        width: data.width ?? 300,
      });
    }
  }

  isHidden(): boolean {
    return window.getComputedStyle(this.container, null).display === "none";
  }

  setControlValue(data: { id: string; value: unknown }): void {
    const binding = this.bindings.get(data.id);
    if (!binding) return;
    binding.setValue(data.value);
  }

  setControlVisible(data: { id: string; visible: boolean }): void {
    const binding = this.bindings.get(data.id);
    if (binding) {
      if (data.visible) { binding.show(); } else { binding.hide(); }
      return;
    }
    const btn = this.buttons.get(data.id);
    if (btn) {
      if (data.visible) { btn.show(); } else { btn.hide(); }
    }
  }

  setControlDisabled(data: { id: string; disabled: boolean }): void {
    const binding = this.bindings.get(data.id);
    if (binding) {
      if (data.disabled) { binding.disable(); } else { binding.enable(); }
      return;
    }
    const btn = this.buttons.get(data.id);
    if (btn) {
      if (data.disabled) { btn.disable(); } else { btn.enable(); }
    }
  }

  clearControls(): void {
    this.controls = [];
    this.containers = {};
    this.datObj = {};
    this.bindings = new Map();
    this.buttons = new Map();
    this.gui.dispose();

    for (const pane of Object.values(this.panes)) {
      pane.dispose();
    }
    this.panes = {};

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
