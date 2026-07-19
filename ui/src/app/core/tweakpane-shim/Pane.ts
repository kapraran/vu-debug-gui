import { injectStyles } from "./injectStyles";
import { WidgetContainer } from "./WidgetContainer";
import { FolderApi } from "./FolderApi";
import type { PaneConfig } from "./types";

export class Pane extends WidgetContainer {
  readonly element: HTMLElement;
  protected contentEl: HTMLElement;

  constructor(config?: PaneConfig) {
    super();

    const doc = (config?.container?.ownerDocument ?? document)!;
    injectStyles(doc);

    this.element = doc.createElement("div");
    this.element.className = "shim-pane";

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

  dispose(): void {
    this.element.remove();
  }
}
