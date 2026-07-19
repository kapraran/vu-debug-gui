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
}
