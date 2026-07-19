import { isValidNumber } from "../utils";
import { wireKeyboard } from "./sharedInput";
import type { AxisParams } from "../types";

export function createVectorElement(
  doc: Document,
  obj: Record<string, unknown>,
  key: string,
  axes: Record<string, AxisParams>,
  onChange: (value: unknown) => void,
): { element: HTMLElement; update: (value: Record<string, unknown>) => void } {
  const axisNames = Object.keys(axes);
  if (!obj[key] || typeof obj[key] !== "object") obj[key] = {};

  const container = doc.createElement("div");
  container.className = "shim-vector-row";

  const axisInputs: Record<string, HTMLInputElement> = {};

  for (const axis of axisNames) {
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
    inputEl.value = String((obj[key] as Record<string, unknown>)[axis] ?? "");

    axisInputs[axis] = inputEl;

    wireKeyboard(inputEl);
    inputEl.addEventListener("change", () => {
      const raw = inputEl.value;
      if (isValidNumber(raw)) {
        (obj[key] as Record<string, unknown>)[axis] = Number(raw);
        onChange(obj[key]);
      } else {
        inputEl.value = String((obj[key] as Record<string, unknown>)[axis] ?? "");
      }
    });

    inputWrapper.append(axisLabel, inputEl);
    axisEl.appendChild(inputWrapper);
    container.appendChild(axisEl);
  }

  const update = (val: Record<string, unknown>) => {
    obj[key] = val;
    for (const axis of axisNames) {
      if (axisInputs[axis]) {
        axisInputs[axis].value = String((val as Record<string, unknown>)[axis] ?? "");
      }
    }
  };

  return { element: container, update };
}
