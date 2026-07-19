import type { DebugGUIControlType } from "./enums/DebugGUIControlType";

export interface ControlData {
  Id: string;
  Type: DebugGUIControlType;
  Name: string;
  Folder?: string;
  Options: ControlOptions;
  IsClient: boolean;
}

export interface AxisOptions {
  min?: number;
  max?: number;
  step?: number;
}

export interface ControlOptions {
  value?: unknown;
  min?: number;
  max?: number;
  step?: number;
  values?: unknown[] | Record<string, unknown>;
  x?: AxisOptions;
  y?: AxisOptions;
  z?: AxisOptions;
  w?: AxisOptions;
}

export interface VeExt {
  addControls: (controls: ControlData[]) => void;
  clearControls: () => void;
  showUI: () => void;
  hideUI: () => void;
  setControlValue: (data: { id: string; value: unknown }) => void;
}
