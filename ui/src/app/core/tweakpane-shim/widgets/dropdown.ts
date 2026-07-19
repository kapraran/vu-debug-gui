import { normalizeOptions, findKeyByValue } from "../utils";

const docsWithDropdownListener = new WeakSet<Document>();

function ensureDropdownListener(doc: Document) {
  if (docsWithDropdownListener.has(doc)) return;
  docsWithDropdownListener.add(doc);
  doc.addEventListener("mousedown", (e: MouseEvent) => {
    doc
      .querySelectorAll(".shim-dropdown-options.open")
      .forEach((el) => {
        if (!el.parentElement?.contains(e.target as Node)) {
          el.classList.remove("open");
        }
      });
  });
}

export function createDropdownElement(
  doc: Document,
  obj: Record<string, unknown>,
  key: string,
  rawOptions: Record<string, unknown> | unknown[],
  currentValue: unknown,
  onChange: (value: unknown) => void,
): HTMLElement {
  ensureDropdownListener(doc);

  const options = normalizeOptions(rawOptions);
  const keys = Object.keys(options);
  const currentKey = findKeyByValue(options, currentValue);
  const displayValue = currentKey ?? String(currentValue ?? keys[0] ?? "");

  const wrapper = doc.createElement("div");
  wrapper.className = "shim-dropdown-wrapper";

  const header = doc.createElement("div");
  header.className = "shim-dropdown-header shim-well";

  const headerValue = doc.createElement("span");
  headerValue.className = "shim-dropdown-header-value";
  headerValue.textContent = displayValue;

  const arrow = doc.createElement("span");
  arrow.className = "shim-dropdown-header-arrow";
  arrow.textContent = "\u25BE";

  header.append(headerValue, arrow);
  wrapper.appendChild(header);

  const optionsContainer = doc.createElement("div");
  optionsContainer.className = "shim-dropdown-options";

  for (const optKey of keys) {
    const opt = doc.createElement("div");
    opt.className = "shim-dropdown-option";
    opt.textContent = optKey;
    if (optKey === displayValue) opt.dataset.selected = "true";
    opt.addEventListener("click", () => {
      optionsContainer.classList.remove("open");
      optionsContainer.querySelectorAll("[data-selected]").forEach((el) => {
        delete (el as HTMLElement).dataset.selected;
      });
      opt.dataset.selected = "true";
      headerValue.textContent = optKey;
      obj[key] = options[optKey];
      onChange(obj[key]);
    });
    optionsContainer.appendChild(opt);
  }

  wrapper.appendChild(optionsContainer);

  header.addEventListener("click", () => {
    optionsContainer.classList.toggle("open");
  });

  return wrapper;
}
