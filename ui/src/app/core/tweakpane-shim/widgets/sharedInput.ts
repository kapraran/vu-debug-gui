import { enableKeyboard, resetKeyboard } from "../../WebUI";

export function wireKeyboard(input: HTMLInputElement) {
  input.addEventListener("focus", () => {
    enableKeyboard();
    input.select();
  });
  input.addEventListener("blur", resetKeyboard);
}
