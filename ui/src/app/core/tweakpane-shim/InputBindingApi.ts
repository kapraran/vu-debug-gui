import type { InputBindingParams } from "./types";
import { createCheckboxElement } from "./widgets/checkbox";
import { createSliderElement } from "./widgets/slider";
import { createNumberElement } from "./widgets/number";
import { createTextElement } from "./widgets/text";
import { createDropdownElement } from "./widgets/dropdown";
import { createVectorElement } from "./widgets/vector";

export class InputBindingApi {
  readonly element: HTMLElement;
  private changeHandlers = new Set<(ev: { value: unknown }) => void>();
  private obj: Record<string, unknown>;
  private key: string;
  private updateWidget: ((value: unknown) => void) | null = null;

  constructor(doc: Document, obj: Record<string, unknown>, key: string, params?: InputBindingParams) {
    this.obj = obj;
    this.key = key;
    this.element = doc.createElement("div");
    this.element.className = "shim-input";

    const value = obj[key];
    const isDropdown = params != null && "options" in params;
    const isVector = params != null && "x" in params;
    const isRange = params?.slider === true;

    if (params?.label) {
      const labelEl = doc.createElement("div");
      labelEl.className = "shim-input-label";
      labelEl.textContent = params.label;
      this.element.appendChild(labelEl);

      if (params?.tooltip) {
        const icon = doc.createElement("span");
        icon.className = "shim-tooltip-icon";
        icon.textContent = "?";
        this.element.appendChild(icon);

        const popover = doc.createElement("div");
        popover.className = "shim-tooltip-popover";
        const lines = params.tooltip.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (i > 0) popover.appendChild(doc.createElement("br"));
          popover.appendChild(doc.createTextNode(lines[i]));
        }
        this.element.appendChild(popover);
      }
    }

    const emitChange = (newValue: unknown) => {
      this.changeHandlers.forEach((h) => h({ value: newValue }));
    };

    if (typeof value === "boolean") {
      const result = createCheckboxElement(doc, obj, key, value, emitChange);
      this.element.appendChild(result.element);
      this.updateWidget = (v) => result.update(v as boolean);
    } else if (isDropdown && params.options) {
      const result = createDropdownElement(doc, obj, key, params.options, value, emitChange);
      this.element.appendChild(result.element);
      this.updateWidget = result.update;
    } else if (isVector) {
      const axes: Record<string, { min?: number; max?: number; step?: number }> = {};
      if (params.x) axes.x = params.x;
      if (params.y) axes.y = params.y;
      if (params.z) axes.z = params.z;
      if (params.w) axes.w = params.w;
      const result = createVectorElement(doc, obj, key, axes, emitChange);
      this.element.appendChild(result.element);
      this.updateWidget = (v) => result.update(v as Record<string, unknown>);
    } else if (isRange) {
      const result = createSliderElement(
        doc, obj, key,
        params.min ?? 0, params.max ?? 100, params.step ?? 1,
        (value ?? params.min ?? 0) as number,
        emitChange,
        params?.format,
      );
      this.element.append(result.wrapper, result.valueDisplay);
      this.updateWidget = (v) => result.update(v as number);
    } else if (typeof value === "number") {
      const result = createNumberElement(doc, obj, key, value, { min: params?.min, max: params?.max, step: params?.step }, emitChange, params?.format);
      this.element.appendChild(result.element);
      this.updateWidget = (v) => result.update(v as number);
    } else {
      const result = createTextElement(doc, obj, key, String(value ?? ""), emitChange);
      this.element.appendChild(result.element);
      this.updateWidget = (v) => result.update(v as string);
    }
  }

  on(_: "change", handler: (ev: { value: unknown }) => void): this {
    this.changeHandlers.add(handler);
    return this;
  }

  setValue(value: unknown): void {
    this.obj[this.key] = value;
    if (this.updateWidget) {
      this.updateWidget(value);
    }
  }

  show(): void {
    this.element.style.display = "";
  }

  hide(): void {
    this.element.style.display = "none";
  }

  toggle(): void {
    if (this.element.style.display === "none") {
      this.element.style.display = "";
    } else {
      this.element.style.display = "none";
    }
  }

  enable(): void {
    this.element.classList.remove("shim-disabled");
    const inputs = this.element.querySelectorAll("input");
    for (const input of inputs) {
      input.disabled = false;
    }
  }

  disable(): void {
    this.element.classList.add("shim-disabled");
    const inputs = this.element.querySelectorAll("input");
    for (const input of inputs) {
      input.disabled = true;
    }
  }
}
