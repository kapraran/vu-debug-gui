import { wireKeyboard } from "./sharedInput";

export function createTextElement(
  doc: Document,
  obj: Record<string, unknown>,
  key: string,
  value: string,
  onChange: (value: string) => void,
): { element: HTMLElement; update: (value: string) => void } {
  const inputEl = doc.createElement("input");
  inputEl.className = "shim-input-text shim-well";
  inputEl.type = "text";
  inputEl.value = String(value ?? "");

  wireKeyboard(inputEl);

  inputEl.addEventListener("change", () => {
    obj[key] = inputEl.value;
    onChange(inputEl.value);
  });

  const update = (val: string) => {
    inputEl.value = String(val);
    obj[key] = val;
  };

  return { element: inputEl, update };
}
