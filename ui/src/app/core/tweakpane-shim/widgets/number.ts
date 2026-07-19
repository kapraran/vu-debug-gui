import { isValidNumber, stepDecimals } from "../utils";
import { wireKeyboard } from "./sharedInput";

export type NumberConstraints = {
  min?: number;
  max?: number;
  step?: number;
};

export function createNumberElement(
  doc: Document,
  obj: Record<string, unknown>,
  key: string,
  value: number,
  constraints: NumberConstraints,
  onChange: (value: number) => void,
): HTMLElement {
  const { min, max, step } = constraints;
  const inputEl = doc.createElement("input");
  inputEl.className = "shim-input-number shim-well";
  inputEl.type = "text";
  inputEl.inputMode = "decimal";
  inputEl.value = String(value ?? "");

  wireKeyboard(inputEl);

  inputEl.addEventListener("change", () => {
    if (isValidNumber(inputEl.value)) {
      let num = Number(inputEl.value);
      if (min != null) num = Math.max(min, num);
      if (max != null) num = Math.min(max, num);
      if (step != null) {
        const decimals = stepDecimals(step);
        num = parseFloat((Math.round(num / step) * step).toFixed(decimals));
      }
      obj[key] = num;
      inputEl.value = String(num);
      onChange(num);
    } else {
      inputEl.value = String(obj[key] ?? "");
    }
  });

  return inputEl;
}
