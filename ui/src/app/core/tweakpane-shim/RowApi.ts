import { WidgetContainer } from "./WidgetContainer";
import { FolderApi } from "./FolderApi";
import { TabApi } from "./TabApi";

export class RowApi extends WidgetContainer {
  readonly element: HTMLElement;
  protected contentEl: HTMLElement;

  constructor(title: string | undefined, doc: Document) {
    super();

    this.element = doc.createElement("div");
    this.element.className = "shim-row";

    if (title) {
      const titleEl = doc.createElement("span");
      titleEl.className = "shim-row-title";
      titleEl.textContent = title;
      this.element.appendChild(titleEl);
    }

    this.contentEl = doc.createElement("div");
    this.contentEl.className = "shim-row-content";
    this.element.appendChild(this.contentEl);
  }

  addFolder(params: { title: string }): FolderApi {
    const folder = new FolderApi(params.title, this.element.ownerDocument!);
    this.contentEl.appendChild(folder.element);
    return folder;
  }

  addTab(params: { title: string }): TabApi {
    const tab = new TabApi(params.title, this.element.ownerDocument!);
    this.contentEl.appendChild(tab.element);
    return tab;
  }

  addRow(params: { title?: string }): RowApi {
    const row = new RowApi(params.title, this.element.ownerDocument!);
    this.contentEl.appendChild(row.element);
    return row;
  }
}
