import { CSS_CONTENT } from "./styles";

let stylesInjected = false;

export function injectStyles(doc: Document) {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = doc.createElement("style");
  style.textContent = CSS_CONTENT;
  doc.head.appendChild(style);
}
