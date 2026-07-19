import type { DebugGUIControlType } from "../../enums/DebugGUIControlType";

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
  x?: AxisParams;
  y?: AxisParams;
  z?: AxisParams;
  w?: AxisParams;
};

export interface PaneConfig {
  title?: string;
  container?: HTMLElement;
}

export interface ControlData {
  Id: string;
  Type: DebugGUIControlType;
  Name: string;
  Folder?: string;
  Options: ControlOptions;
  IsClient: boolean;
}

export interface ControlOptions {
  DefValue?: unknown;
  Min?: number;
  Max?: number;
  Step?: number;
  Values?: unknown[] | Record<string, unknown>;
  x?: AxisOptions;
  y?: AxisOptions;
  z?: AxisOptions;
  w?: AxisOptions;
}

export interface AxisOptions {
  Min?: number;
  Max?: number;
  Step?: number;
}
