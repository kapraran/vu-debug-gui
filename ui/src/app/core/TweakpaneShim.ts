import { enableKeyboard, resetKeyboard } from "./WebUI";

let stylesInjected = false;

export type AxisParams = {
  min?: number;
  max?: number;
  step?: number;
};

export type InputBindingParams = {
  label?: string;
  slider?: true;
  options?: Record<string, any> | any[];
  min?: number;
  max?: number;
  step?: number;
  x?: AxisParams;
  y?: AxisParams;
  z?: AxisParams;
  w?: AxisParams;
};

function injectStyles(doc: Document) {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = doc.createElement("style");
  style.textContent = `
.shim-pane, .shim-pane * {
  box-sizing: border-box;
}
.shim-pane {
  font-family: 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 400;
  background: linear-gradient(180deg, #22242b 0%, #1b1d23 100%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.45);
  line-height: 1;
  text-align: left;
  color: #e8e9ee;
  width: 300px;
  margin: 8px 0;
  user-select: none;
}
.shim-pane input {
  user-select: text;
}
.shim-pane ::-webkit-scrollbar {
  width: 8px;
}
.shim-pane ::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 4px;
}
.shim-pane-title {
  background-color: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(232,147,60,0.4);
  border-radius: 7px 7px 0 0;
  color: #e8e9ee;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  padding: 0 12px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.shim-pane-content {
  padding: 8px;
}
.shim-pane-content > * + * {
  margin-top: 6px;
}
.shim-btn {
  background-color: #2a2d35;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  color: #e8e9ee;
  cursor: pointer;
  display: block;
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 600;
  height: 26px;
  line-height: 24px;
  margin: 0;
  overflow: hidden;
  padding: 0 8px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}
.shim-btn:hover {
  background-color: #e8933c;
  border-color: #e8933c;
  color: #14161b;
}
.shim-btn:active {
  background-color: #d17f2a;
  border-color: #d17f2a;
}
.shim-folder-title {
  background-color: rgba(255,255,255,0.03);
  color: #e8e9ee;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.5px;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
  padding: 0 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  border-radius: 3px;
  transition: background-color 120ms ease;
}
.shim-folder-title:hover {
  background-color: rgba(255,255,255,0.07);
}
.shim-folder-chevron {
  color: #8a8d98;
  font-size: 9px;
  flex-shrink: 0;
  transition: transform 120ms ease;
}
.shim-folder.expanded > .shim-folder-title .shim-folder-chevron {
  transform: rotate(90deg);
}
.shim-folder-content {
  border-left: 1px solid rgba(255,255,255,0.06);
  margin: 4px 0 4px 6px;
  padding: 6px 4px 6px 8px;
}
.shim-folder-content > * + * {
  margin-top: 6px;
}
.shim-input {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 22px;
  position: relative;
}
.shim-input-clickable {
  cursor: pointer;
}
.shim-input-label {
  color: #8a8d98;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  width: 38%;
}
.shim-well {
  background-color: #14161b;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 3px;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
.shim-well:hover {
  border-color: rgba(255,255,255,0.14);
}
.shim-well:focus, .shim-well:focus-within {
  border-color: rgba(232,147,60,0.6);
  box-shadow: 0 0 0 1px rgba(232,147,60,0.25);
  outline: none;
}
.shim-input-number, .shim-input-text {
  flex: 1;
  min-width: 0;
  height: 20px;
  padding: 0 6px;
  color: #e8e9ee;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  text-align: left;
}
.shim-slider-wrapper {
  position: relative;
  height: 22px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}
.shim-slider-track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 3px;
  margin-top: -1.5px;
  background-color: rgba(255,255,255,0.08);
  border-radius: 2px;
  pointer-events: none;
}
.shim-slider-fill {
  position: absolute;
  left: 0;
  top: 50%;
  height: 3px;
  margin-top: -1.5px;
  background-color: #e8933c;
  border-radius: 2px;
  pointer-events: none;
}
.shim-slider-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  background-color: #e8933c;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
  pointer-events: none;
  transition: background-color 120ms ease;
}
.shim-slider-wrapper:hover .shim-slider-thumb {
  background-color: #f5a95c;
}
.shim-slider-value {
  display: flex;
  align-items: center;
  height: 20px;
  min-width: 34px;
  padding: 0 6px;
  color: #e8e9ee;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  flex-shrink: 0;
}
.shim-checkbox-spacer {
  flex: 1;
  display: flex;
  align-items: center;
}
.shim-checkbox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background-color: #14161b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 3px;
  transition: border-color 120ms ease, background-color 120ms ease;
}
.shim-input-clickable:hover .shim-checkbox-box {
  border-color: rgba(232,147,60,0.6);
}
.shim-checkbox-box.checked {
  background-color: rgba(232,147,60,0.15);
  border-color: #e8933c;
}
.shim-checkbox-check {
  display: none;
  align-items: center;
  justify-content: center;
}
.shim-checkbox-box.checked .shim-checkbox-check {
  display: flex;
}
.shim-vector-row {
  display: flex;
  flex: 1;
  gap: 4px;
  min-width: 0;
}
.shim-vector-axis {
  display: flex;
  flex: 1;
  min-width: 0;
}
.shim-vector-axis-input {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  height: 20px;
  overflow: hidden;
}
.shim-vector-axis-label {
  color: #8a8d98;
  font-size: 10px;
  flex-shrink: 0;
  width: 12px;
  text-align: center;
  line-height: 20px;
  background-color: rgba(255,255,255,0.03);
}
.shim-vector-axis-input input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background-color: transparent;
  border: 0;
  color: #e8e9ee;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  padding: 0 3px;
  text-align: left;
  outline: none;
}
.shim-dropdown-wrapper {
  position: relative;
  flex: 1;
  min-width: 0;
}
.shim-dropdown-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 20px;
  padding: 0 6px;
  user-select: none;
}
.shim-dropdown-header-value {
  flex: 1;
  min-width: 0;
  color: #e8e9ee;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.shim-dropdown-header-arrow {
  color: #8a8d98;
  font-size: 8px;
  margin-left: 4px;
  flex-shrink: 0;
}
.shim-dropdown-options {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 1000;
  background-color: #262932;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  margin-top: 2px;
  max-height: 140px;
  overflow-y: auto;
}
.shim-dropdown-options.open {
  display: block;
  animation: shim-dropdown-in 120ms ease;
}
@keyframes shim-dropdown-in {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
}
.shim-dropdown-option {
  padding: 5px 8px;
  cursor: pointer;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  color: #e8e9ee;
  transition: background-color 120ms ease;
}
.shim-dropdown-option:hover {
  background-color: rgba(232,147,60,0.15);
}
.shim-dropdown-option[data-selected="true"] {
  background-color: rgba(232,147,60,0.25);
  color: #fff;
}
`;
  doc.head.appendChild(style);
}

const docsWithDropdownListener = new WeakSet<Document>();

function ensureDropdownListener(doc: Document) {
  if (docsWithDropdownListener.has(doc)) return;
  docsWithDropdownListener.add(doc);
  doc.addEventListener("mousedown", (e) => {
    doc
      .querySelectorAll(".shim-dropdown-options.open")
      .forEach((el) => {
        if (!el.parentElement?.contains(e.target as Node)) {
          el.classList.remove("open");
        }
      });
  });
}

function wireKeyboard(input: HTMLInputElement) {
  input.addEventListener("focus", () => {
    enableKeyboard();
    input.select();
  });
  input.addEventListener("blur", resetKeyboard);
}

function isValidNumber(raw: string): boolean {
  return raw.trim() !== "" && !isNaN(Number(raw));
}

function stepDecimals(step: number): number {
  const s = String(step);
  return s.includes(".") ? s.split(".")[1].length : 0;
}

function normalizeOptions(raw: Record<string, any> | any[]): Record<string, any> {
  if (Array.isArray(raw)) {
    return Object.fromEntries(raw.map((v) => [String(v), v]));
  }
  return raw;
}

function findKeyByValue(options: Record<string, any>, value: any): string | undefined {
  for (const [k, v] of Object.entries(options)) {
    if (v === value) return k;
  }
  return undefined;
}

class ButtonApi {
  readonly element: HTMLButtonElement;
  private clickHandlers = new Set<(ev: any) => void>();

  constructor(title: string, doc: Document) {
    this.element = doc.createElement("button");
    this.element.className = "shim-btn";
    this.element.textContent = title;
    this.element.addEventListener("click", (nativeEvent) => {
      const ev = { nativeEvent, sender: this };
      this.clickHandlers.forEach((h) => h(ev));
    });
  }

  on(_: "click", handler: (ev: any) => void): this {
    this.clickHandlers.add(handler);
    return this;
  }
}

class InputBindingApi {
  readonly element: HTMLElement;
  private changeHandlers = new Set<(ev: { value: any }) => void>();

  constructor(doc: Document, obj: Record<string, any>, key: string, params?: InputBindingParams) {
    this.element = doc.createElement("div");
    this.element.className = "shim-input";

    const value = obj[key];
    const isRange = params?.slider === true;
    const isDropdown = params && "options" in params;
    const isVector = params && "x" in params;

    if (params?.label) {
      const labelEl = doc.createElement("div");
      labelEl.className = "shim-input-label";
      labelEl.textContent = params.label;
      this.element.appendChild(labelEl);
    }

    if (typeof value === "boolean") {
      this.element.classList.add("shim-input-clickable");

      const spacer = doc.createElement("div");
      spacer.className = "shim-checkbox-spacer";

      const box = doc.createElement("div");
      box.className = "shim-checkbox-box";
      if (value) box.classList.add("checked");

      const check = doc.createElement("span");
      check.className = "shim-checkbox-check";
      const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "12");
      svg.setAttribute("height", "12");
      svg.setAttribute("viewBox", "0 0 12 12");
      const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M2 6.5 L5 9.5 L10 2.5");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#e8933c");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
      check.appendChild(svg);
      box.appendChild(check);
      spacer.appendChild(box);
      this.element.appendChild(spacer);

      this.element.addEventListener("click", () => {
        const checked = !box.classList.contains("checked");
        box.classList.toggle("checked", checked);
        obj[key] = checked;
        this.changeHandlers.forEach((h) => h({ value: checked }));
      });
    } else if (isDropdown && params.options) {
      ensureDropdownListener(doc);

      const options = normalizeOptions(params.options);
      const keys = Object.keys(options);
      const currentKey = findKeyByValue(options, value);
      const currentValue = currentKey ?? String(value ?? keys[0] ?? "");

      const wrapper = doc.createElement("div");
      wrapper.className = "shim-dropdown-wrapper";

      const header = doc.createElement("div");
      header.className = "shim-dropdown-header shim-well";

      const headerValue = doc.createElement("span");
      headerValue.className = "shim-dropdown-header-value";
      headerValue.textContent = currentValue;

      const arrow = doc.createElement("span");
      arrow.className = "shim-dropdown-header-arrow";
      arrow.textContent = "▾";

      header.append(headerValue, arrow);
      wrapper.appendChild(header);

      const optionsContainer = doc.createElement("div");
      optionsContainer.className = "shim-dropdown-options";

      for (const optKey of keys) {
        const opt = doc.createElement("div");
        opt.className = "shim-dropdown-option";
        opt.textContent = optKey;
        if (optKey === currentValue) opt.dataset.selected = "true";
        opt.addEventListener("click", () => {
          optionsContainer.classList.remove("open");
          optionsContainer.querySelectorAll("[data-selected]").forEach((el) => {
            delete (el as HTMLElement).dataset.selected;
          });
          opt.dataset.selected = "true";
          headerValue.textContent = optKey;
          obj[key] = options[optKey];
          this.changeHandlers.forEach((h) => h({ value: obj[key] }));
        });
        optionsContainer.appendChild(opt);
      }

      wrapper.appendChild(optionsContainer);

      header.addEventListener("click", () => {
        optionsContainer.classList.toggle("open");
      });

      this.element.appendChild(wrapper);
    } else if (isVector) {
      const axes = ["x", "y", "z", "w"].filter((a) => a in params) as string[];
      if (!obj[key] || typeof obj[key] !== "object") obj[key] = {};

      const container = doc.createElement("div");
      container.className = "shim-vector-row";

      for (const axis of axes) {
        const axisEl = doc.createElement("div");
        axisEl.className = "shim-vector-axis";

        const inputWrapper = doc.createElement("div");
        inputWrapper.className = "shim-vector-axis-input shim-well";

        const axisLabel = doc.createElement("span");
        axisLabel.className = "shim-vector-axis-label";
        axisLabel.textContent = axis;

        const inputEl = doc.createElement("input");
        inputEl.type = "text";
        inputEl.inputMode = "decimal";
        inputEl.value = String(obj[key][axis] ?? "");
        wireKeyboard(inputEl);
        inputEl.addEventListener("change", () => {
          const raw = inputEl.value;
          if (isValidNumber(raw)) {
            obj[key][axis] = Number(raw);
            this.changeHandlers.forEach((h) => h({ value: obj[key] }));
          } else {
            inputEl.value = String(obj[key][axis] ?? "");
          }
        });

        inputWrapper.append(axisLabel, inputEl);
        axisEl.appendChild(inputWrapper);
        container.appendChild(axisEl);
      }

      this.element.appendChild(container);
    } else if (isRange) {
      const min = params.min as number;
      const max = params.max as number;
      const step = (params.step as number) ?? 1;
      const decimals = stepDecimals(step);
      let currentValue = (value ?? min) as number;

      const wrapper = doc.createElement("div");
      wrapper.className = "shim-slider-wrapper";

      const track = doc.createElement("div");
      track.className = "shim-slider-track";

      const fill = doc.createElement("div");
      fill.className = "shim-slider-fill";

      const thumb = doc.createElement("div");
      thumb.className = "shim-slider-thumb";

      wrapper.append(track, fill, thumb);

      const valueDisplay = doc.createElement("span");
      valueDisplay.className = "shim-slider-value shim-well";

      const formatValue = (val: number) =>
        decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));

      const updateSlider = (val: number) => {
        const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
        fill.style.width = pct + "%";
        thumb.style.left = pct + "%";
        valueDisplay.textContent = formatValue(val);
      };

      const getValue = (clientX: number): number => {
        const rect = wrapper.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const raw = min + pct * (max - min);
        if (step >= 1) {
          return Math.max(min, Math.min(max, Math.round(raw / step) * step));
        }
        return Math.max(min, Math.min(max, +(Math.round(raw / step) * step).toFixed(6)));
      };

      let dragging = false;

      const onMove = (e: MouseEvent) => {
        if (!dragging) return;
        const val = getValue(e.clientX);
        if (val !== currentValue) {
          currentValue = val;
          updateSlider(val);
          obj[key] = val;
          this.changeHandlers.forEach((h) => h({ value: val }));
        }
      };

      const onUp = () => {
        dragging = false;
        doc.removeEventListener("mousemove", onMove);
        doc.removeEventListener("mouseup", onUp);
      };

      wrapper.addEventListener("mousedown", (e: MouseEvent) => {
        dragging = true;
        const val = getValue(e.clientX);
        currentValue = val;
        updateSlider(val);
        obj[key] = val;
        this.changeHandlers.forEach((h) => h({ value: val }));
        doc.addEventListener("mousemove", onMove);
        doc.addEventListener("mouseup", onUp);
      });

      updateSlider(currentValue);
      this.element.append(wrapper, valueDisplay);
    } else {
      const numeric = typeof value === "number";
      const inputEl = doc.createElement("input");
      inputEl.className = (numeric ? "shim-input-number" : "shim-input-text") + " shim-well";
      inputEl.type = "text";
      if (numeric) inputEl.inputMode = "decimal";
      inputEl.value = String(value ?? "");
      this.element.appendChild(inputEl);

      wireKeyboard(inputEl);
      inputEl.addEventListener("change", () => {
        if (numeric) {
          if (isValidNumber(inputEl.value)) {
            let num = Number(inputEl.value);
            if (params?.min != null) num = Math.max(params.min, num);
            if (params?.max != null) num = Math.min(params.max, num);
            if (params?.step != null) {
              const decimals = stepDecimals(params.step);
              num = parseFloat((Math.round(num / params.step) * params.step).toFixed(decimals));
            }
            obj[key] = num;
            inputEl.value = String(num);
            this.changeHandlers.forEach((h) => h({ value: num }));
          } else {
            inputEl.value = String(obj[key] ?? "");
          }
        } else {
          obj[key] = inputEl.value;
          this.changeHandlers.forEach((h) => h({ value: inputEl.value }));
        }
      });
    }
  }

  on(_: "change", handler: (ev: { value: any }) => void): this {
    this.changeHandlers.add(handler);
    return this;
  }
}

class FolderApi {
  readonly element: HTMLElement;
  protected contentEl: HTMLElement;
  private _expanded = true;

  constructor(title: string | undefined, doc: Document) {
    this.element = doc.createElement("div");
    this.element.className = "shim-folder expanded";

    if (title) {
      const titleEl = doc.createElement("div");
      titleEl.className = "shim-folder-title";

      const chevron = doc.createElement("span");
      chevron.className = "shim-folder-chevron";
      chevron.textContent = "▸";

      const titleText = doc.createElement("span");
      titleText.textContent = title;

      titleEl.append(chevron, titleText);
      titleEl.addEventListener("click", () => {
        this._expanded = !this._expanded;
        this.element.classList.toggle("expanded", this._expanded);
        this.contentEl.style.display = this._expanded ? "" : "none";
      });
      this.element.appendChild(titleEl);
    }

    this.contentEl = doc.createElement("div");
    this.contentEl.className = "shim-folder-content";
    this.element.appendChild(this.contentEl);
  }

  addButton(params: { title: string }): ButtonApi {
    const btn = new ButtonApi(params.title, this.element.ownerDocument!);
    this.contentEl.appendChild(btn.element);
    return btn;
  }

  addFolder(params: { title: string }): FolderApi {
    const folder = new FolderApi(params.title, this.element.ownerDocument!);
    this.contentEl.appendChild(folder.element);
    return folder;
  }

  addBinding(obj: Record<string, any>, key: string, params?: InputBindingParams): InputBindingApi {
    const binding = new InputBindingApi(this.element.ownerDocument!, obj, key, params);
    this.contentEl.appendChild(binding.element);
    return binding;
  }
}

interface PaneConfig {
  title?: string;
  container?: HTMLElement;
}

class Pane {
  readonly element: HTMLElement;
  private contentEl: HTMLElement;

  constructor(config?: PaneConfig) {
    const doc = (config?.container?.ownerDocument ?? document)!;
    injectStyles(doc);

    this.element = doc.createElement("div");
    this.element.className = "shim-pane";

    if (config?.title) {
      const titleEl = doc.createElement("div");
      titleEl.className = "shim-pane-title";
      titleEl.textContent = config.title;
      this.element.appendChild(titleEl);
    }

    this.contentEl = doc.createElement("div");
    this.contentEl.className = "shim-pane-content";
    this.element.appendChild(this.contentEl);

    const container = config?.container ?? doc.body;
    container.appendChild(this.element);
  }

  addButton(params: { title: string }): ButtonApi {
    const btn = new ButtonApi(params.title, this.element.ownerDocument!);
    this.contentEl.appendChild(btn.element);
    return btn;
  }

  addFolder(params: { title: string }): FolderApi {
    const folder = new FolderApi(params.title, this.element.ownerDocument!);
    this.contentEl.appendChild(folder.element);
    return folder;
  }

  addBinding(obj: Record<string, any>, key: string, params?: InputBindingParams): InputBindingApi {
    const binding = new InputBindingApi(this.element.ownerDocument!, obj, key, params);
    this.contentEl.appendChild(binding.element);
    return binding;
  }

  dispose(): void {
    this.element.remove();
  }
}

export { Pane, FolderApi };
export type { ButtonApi, InputBindingApi };
