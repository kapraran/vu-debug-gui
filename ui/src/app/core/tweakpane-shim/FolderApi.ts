import { WidgetContainer } from "./WidgetContainer";

export class FolderApi extends WidgetContainer {
  readonly element: HTMLElement;
  protected contentEl: HTMLElement;
  private expanded = true;

  constructor(title: string | undefined, doc: Document) {
    super();

    this.element = doc.createElement("div");
    this.element.className = "shim-folder expanded";

    if (title) {
      const titleEl = doc.createElement("div");
      titleEl.className = "shim-folder-title";

      const chevron = doc.createElement("span");
      chevron.className = "shim-folder-chevron";

      const titleText = doc.createElement("span");
      titleText.textContent = title;

      titleEl.append(chevron, titleText);
      titleEl.addEventListener("click", () => {
        this.expanded = !this.expanded;
        this.element.classList.toggle("expanded", this.expanded);
        this.contentEl.style.display = this.expanded ? "" : "none";
      });
      this.element.appendChild(titleEl);
    }

    this.contentEl = doc.createElement("div");
    this.contentEl.className = "shim-folder-content";
    this.element.appendChild(this.contentEl);
  }

  addFolder(params: { title: string }): FolderApi {
    const folder = new FolderApi(params.title, this.element.ownerDocument!);
    this.contentEl.appendChild(folder.element);
    return folder;
  }
}
