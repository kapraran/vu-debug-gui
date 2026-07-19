export function createCheckboxElement(
  doc: Document,
  obj: Record<string, unknown>,
  key: string,
  value: boolean,
  onChange: (value: boolean) => void,
): { element: HTMLElement; update: (value: boolean) => void } {
  const element = doc.createElement("div");
  element.classList.add("shim-input", "shim-input-clickable");

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
  element.appendChild(spacer);

  element.addEventListener("click", () => {
    const checked = !box.classList.contains("checked");
    box.classList.toggle("checked", checked);
    obj[key] = checked;
    onChange(checked);
  });

  const update = (val: boolean) => {
    box.classList.toggle("checked", val);
    obj[key] = val;
  };

  return { element, update };
}
