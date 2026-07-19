import { InputBindingApi } from "./InputBindingApi";
import { ButtonApi } from "./ButtonApi";
import type { InputBindingParams } from "./types";

export abstract class WidgetContainer {
  abstract readonly element: HTMLElement;
  protected abstract contentEl: HTMLElement;

  addButton(params: { title: string; tooltip?: string; icon?: string }): ButtonApi {
    const btn = new ButtonApi(params.title, this.element.ownerDocument!, params.icon);
    if (params.tooltip) {
      btn.element.title = params.tooltip;
    }
    this.contentEl.appendChild(btn.element);
    return btn;
  }

  abstract addFolder(params: { title: string }): WidgetContainer;
  abstract addTab(params: { title: string }): WidgetContainer;
  abstract addRow(params: { title?: string }): WidgetContainer;

  addBinding(obj: Record<string, unknown>, key: string, params?: InputBindingParams): InputBindingApi {
    const binding = new InputBindingApi(this.element.ownerDocument!, obj, key, params);
    this.contentEl.appendChild(binding.element);
    return binding;
  }
}
