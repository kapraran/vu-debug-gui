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

export type IconData = { viewBox: string; path: string };

export interface PaneConfig {
  title?: string;
  container?: HTMLElement;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  width?: number | string;
}

export interface TabConfig {
  title: string;
}

export interface RowConfig {
  title?: string;
}
