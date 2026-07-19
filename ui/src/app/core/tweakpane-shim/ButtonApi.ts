import { ICON_REGISTRY } from "#icons";

export function createIconSvg(icon: string, doc: Document): SVGElement | null {
  if (!__ICONS__) return null;
  const data = ICON_REGISTRY[icon];
  if (!data) return null;
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = doc.createElementNS(xmlns, "svg");
  svg.setAttribute("viewBox", data.viewBox);
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("class", "shim-btn-icon");
  const path = doc.createElementNS(xmlns, "path");
  path.setAttribute("d", data.path);
  path.setAttribute("fill", "white");
  svg.appendChild(path);
  return svg;
}

export class ButtonApi {
  readonly element: HTMLButtonElement;
  private clickHandlers = new Set<(ev: { nativeEvent: MouseEvent; sender: ButtonApi }) => void>();

  constructor(title: string, doc: Document, icon?: string) {
    this.element = doc.createElement("button");
    this.element.className = "shim-btn";
    if (icon) {
      const svg = createIconSvg(icon, doc);
      if (svg) {
        this.element.appendChild(svg);
      }
    }
    const textEl = doc.createElement("span");
    textEl.textContent = title;
    this.element.appendChild(textEl);
    this.element.addEventListener("click", (nativeEvent) => {
      const ev = { nativeEvent, sender: this };
      this.clickHandlers.forEach((h) => h(ev));
    });
  }

  on(_: "click", handler: (ev: { nativeEvent: MouseEvent; sender: ButtonApi }) => void): this {
    this.clickHandlers.add(handler);
    return this;
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
    this.element.classList.remove("shim-btn-disabled");
  }

  disable(): void {
    this.element.classList.add("shim-btn-disabled");
  }
}
