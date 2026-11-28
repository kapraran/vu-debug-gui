import { stepDecimals } from "../utils";
import { isValidNumber } from "../utils";
import { wireKeyboard } from "./sharedInput";

export function createSliderElement(
  doc: Document,
  obj: Record<string, unknown>,
  key: string,
  min: number,
  max: number,
  step: number,
  currentValue: number,
  onChange: (value: number) => void,
): [wrapper: HTMLElement, valueDisplay: HTMLElement] {
  const decimals = stepDecimals(step);
  const defaultValue = currentValue;

  const wrapper = doc.createElement("div");
  wrapper.className = "shim-slider-wrapper";

  const track = doc.createElement("div");
  track.className = "shim-slider-track";

  const fill = doc.createElement("div");
  fill.className = "shim-slider-fill";

  const thumb = doc.createElement("div");
  thumb.className = "shim-slider-thumb";

  wrapper.append(track, fill, thumb);

  const valueDisplay = doc.createElement("input");
  valueDisplay.type = "text";
  valueDisplay.className = "shim-slider-value shim-well";
  wireKeyboard(valueDisplay);

  const formatValue = (val: number): string =>
    decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));

  let editing = false;

  const updateSlider = (val: number) => {
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    if (!editing) valueDisplay.value = formatValue(val);
    // Compare displayed values, not raw floats: stock 0.694265... displays as
    // 0.6943, and a step-quantized 0.6943 is the same value to the player.
    if (formatValue(val) !== formatValue(defaultValue)) {
      valueDisplay.classList.add("shim-modified");
    } else {
      valueDisplay.classList.remove("shim-modified");
    }
  };

  const getValue = (clientX: number): number => {
    const rect = wrapper.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    if (step >= 1) {
      return Math.max(min, Math.min(max, Math.round(raw / step) * step));
    }
    return Math.max(min, Math.min(max, +(Math.round(raw / step) * step).toFixed(6)));
  };

  const commitTypedValue = () => {
    // Nothing was typed: the box still shows the current value. Committing here
    // would quantize the stock float (0.694265... -> 0.6943) and fire onChange.
    if (valueDisplay.value === formatValue(currentValue)) return;
    if (!isValidNumber(valueDisplay.value)) {
      valueDisplay.value = formatValue(currentValue);
      return;
    }
    let val = Number(valueDisplay.value);
    val = Math.max(min, Math.min(max, val));
    if (step != null) {
      val = +(Math.round(val / step) * step).toFixed(decimals);
    }
    currentValue = val;
    obj[key] = val;
    valueDisplay.value = formatValue(val);
    updateSlider(val);
    onChange(val);
  };

  valueDisplay.addEventListener("focus", () => { editing = true; });
  valueDisplay.addEventListener("blur", () => {
    editing = false;
    commitTypedValue();
  });
  valueDisplay.addEventListener("keydown", (e: KeyboardEvent) => {
    // GameFace reports Enter via keyCode 13 even when e.key is not "Enter".
    // blur() commits through the normal path and also clears the editing flag.
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      valueDisplay.blur();
      return;
    }
  });

  let dragging = false;

  const onMove = (e: MouseEvent) => {
    if (!dragging) return;
    const val = getValue(e.clientX);
    if (val !== currentValue) {
      currentValue = val;
      updateSlider(val);
      obj[key] = val;
      onChange(val);
    }
  };

  const onUp = () => {
    dragging = false;
    doc.removeEventListener("mousemove", onMove);
    doc.removeEventListener("mouseup", onUp);
  };

  wrapper.addEventListener("mousedown", (e: MouseEvent) => {
    dragging = true;
    const val = getValue(e.clientX);
    currentValue = val;
    updateSlider(val);
    obj[key] = val;
    onChange(val);
    doc.addEventListener("mousemove", onMove);
    doc.addEventListener("mouseup", onUp);
  });

  updateSlider(currentValue);

  return [wrapper, valueDisplay];
}
