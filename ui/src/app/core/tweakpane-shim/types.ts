export type AxisParams = {
  min?: number;
  max?: number;
  step?: number;
};

export type InputBindingParams = {
  label?: string;
  slider?: true;
  options?: Record<string, unknown> | unknown[];
  min?: number;
  max?: number;
  step?: number;
  format?: string;
  tooltip?: string;
  x?: AxisParams;
  y?: AxisParams;
  z?: AxisParams;
  w?: AxisParams;
};

export interface PaneConfig {
  title?: string;
  container?: HTMLElement;
}
