import { WidgetContainer } from "./WidgetContainer";
import { FolderApi } from "./FolderApi";
import { RowApi } from "./RowApi";

interface TabPage {
  btn: HTMLElement;
  panel: HTMLElement;
}

export class TabApi extends WidgetContainer {
  readonly element: HTMLElement;
  protected contentEl: HTMLElement;
  private tabBar: HTMLElement;
  private panelsContainer: HTMLElement;
  private pages: Record<string, TabPage>;

  constructor(firstPageTitle: string, doc: Document) {
    super();

    this.element = doc.createElement("div");
    this.element.className = "shim-tabs";

    this.tabBar = doc.createElement("div");
    this.tabBar.className = "shim-tab-bar";
    this.element.appendChild(this.tabBar);

    this.panelsContainer = doc.createElement("div");
    this.panelsContainer.className = "shim-tab-panels";
    this.element.appendChild(this.panelsContainer);

    this.pages = {};

    this.contentEl = doc.createElement("div");
    this.switchTab(firstPageTitle);
  }

  switchTab(title: string): void {
    if (!this.pages[title]) {
      const doc = this.element.ownerDocument!;

      const btn = doc.createElement("button");
      btn.className = "shim-tab-btn";
      btn.textContent = title;
      btn.addEventListener("click", () => this.switchTab(title));
      this.tabBar.appendChild(btn);

      const panel = doc.createElement("div");
      panel.className = "shim-tab-panel";
      this.panelsContainer.appendChild(panel);

      this.pages[title] = { btn, panel };
    }

    for (const [key, page] of Object.entries(this.pages)) {
      page.btn.classList.toggle("active", key === title);
      page.panel.style.display = key === title ? "" : "none";
    }

    this.contentEl = this.pages[title].panel;
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
