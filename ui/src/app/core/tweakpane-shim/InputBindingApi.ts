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
    }

    const emitChange = (newValue: unknown) => {
      this.changeHandlers.forEach((h) => h({ value: newValue }));
    };

    if (typeof value === "boolean") {
      const el = createCheckboxElement(doc, obj, key, value, emitChange);
      this.element.appendChild(el);
    } else if (isDropdown && params.options) {
      const el = createDropdownElement(doc, obj, key, params.options, value, emitChange);
      this.element.appendChild(el);
    } else if (isVector) {
      const axes: Record<string, { min?: number; max?: number; step?: number }> = {};
      if (params.x) axes.x = params.x;
      if (params.y) axes.y = params.y;
      if (params.z) axes.z = params.z;
      if (params.w) axes.w = params.w;
      const el = createVectorElement(doc, obj, key, axes, emitChange);
      this.element.appendChild(el);
    } else if (isRange) {
      const [wrapper, valueDisplay] = createSliderElement(
        doc, obj, key,
        params.min ?? 0, params.max ?? 100, params.step ?? 1,
        (value ?? params.min ?? 0) as number,
        emitChange,
      );
      this.element.append(wrapper, valueDisplay);
    } else if (typeof value === "number") {
      const el = createNumberElement(doc, obj, key, value, { min: params?.min, max: params?.max, step: params?.step }, emitChange);
      this.element.appendChild(el);
    } else {
      const el = createTextElement(doc, obj, key, String(value ?? ""), emitChange);
      this.element.appendChild(el);
    }
  }

  on(_: "change", handler: (ev: { value: unknown }) => void): this {
    this.changeHandlers.add(handler);
    return this;
  }

  setValue(value: unknown): void {
    this.obj[this.key] = value;
  }
}
