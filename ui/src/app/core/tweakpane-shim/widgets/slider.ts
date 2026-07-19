import { stepDecimals } from "../utils";

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

  const wrapper = doc.createElement("div");
  wrapper.className = "shim-slider-wrapper";

  const track = doc.createElement("div");
  track.className = "shim-slider-track";

  const fill = doc.createElement("div");
  fill.className = "shim-slider-fill";

  const thumb = doc.createElement("div");
  thumb.className = "shim-slider-thumb";

  wrapper.append(track, fill, thumb);

  const valueDisplay = doc.createElement("span");
  valueDisplay.className = "shim-slider-value shim-well";

  const formatValue = (val: number): string =>
    decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));

  const updateSlider = (val: number) => {
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    fill.style.width = pct + "%";
    thumb.style.left = pct + "%";
    valueDisplay.textContent = formatValue(val);
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
