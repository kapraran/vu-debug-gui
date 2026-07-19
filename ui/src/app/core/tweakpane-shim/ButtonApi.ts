export class ButtonApi {
  readonly element: HTMLButtonElement;
  private clickHandlers = new Set<(ev: { nativeEvent: MouseEvent; sender: ButtonApi }) => void>();

  constructor(title: string, doc: Document) {
    this.element = doc.createElement("button");
    this.element.className = "shim-btn";
    this.element.textContent = title;
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
