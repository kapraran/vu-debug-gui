import { injectStyles } from "./injectStyles";
import { WidgetContainer } from "./WidgetContainer";
import { FolderApi } from "./FolderApi";
import { TabApi } from "./TabApi";
import { RowApi } from "./RowApi";
import type { PaneConfig } from "./types";

const POSITION_CLASS: Record<string, string> = {
  "top-left": "shim-pane-tl",
  "top-right": "shim-pane-tr",
  "bottom-left": "shim-pane-bl",
  "bottom-right": "shim-pane-br",
};

export class Pane extends WidgetContainer {
  readonly element: HTMLElement;
  protected contentEl: HTMLElement;

  constructor(config?: PaneConfig) {
    super();

    const doc = (config?.container?.ownerDocument ?? document)!;
    injectStyles(doc);

    this.element = doc.createElement("div");
    this.element.className = "shim-pane";

    if (config?.position) {
      const posClass = POSITION_CLASS[config.position] ?? "shim-pane-tr";
      this.element.classList.add(posClass);
    }

    if (config?.width) {
      this.element.style.width = typeof config.width === "number" ? config.width + "px" : config.width;
    }

    if (config?.title) {
      const titleEl = doc.createElement("div");
      titleEl.className = "shim-pane-title";
      titleEl.textContent = config.title;
      this.element.appendChild(titleEl);
    }

    this.contentEl = doc.createElement("div");
    this.contentEl.className = "shim-pane-content";
    this.element.appendChild(this.contentEl);

    const container = config?.container ?? doc.body;
    container.appendChild(this.element);
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

  dispose(): void {
    this.element.remove();
  }
}
