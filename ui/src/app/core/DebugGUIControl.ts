import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUICustomEvent from "../enums/DebugGUICustomEvent";
import type { EventPayload } from "./WebUI";
import { dispatchEvent } from "./WebUI";
import type { ControlData, ControlOptions } from "../types";

export type AxisOptions = { min?: number; max?: number; step?: number };

export default class DebugGUIControl {
  readonly id: string;
  readonly type: DebugGUIControlType;
  readonly name: string;
  readonly isClient: boolean;
  readonly defValue: unknown;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly values?: unknown[] | Record<string, unknown>;
  readonly axes?: { x: AxisOptions; y: AxisOptions; z?: AxisOptions; w?: AxisOptions };

  constructor(controlData: ControlData) {
    this.id = controlData.Id;
    this.type = controlData.Type;
    this.name = controlData.Name;
    this.isClient = controlData.IsClient;

    const opts: ControlOptions = controlData.Options ?? {};
    this.defValue = opts.DefValue;
    this.min = opts.Min;
    this.max = opts.Max;
    this.step = opts.Step;
    this.values = opts.Values;

    if (opts.x != null) {
      const resolveAxis = (a: typeof opts.x | typeof opts.y | typeof opts.z | typeof opts.w): { min?: number; max?: number; step?: number } => ({
        min: a?.Min,
        max: a?.Max,
        step: a?.Step,
      });
      this.axes = {
        x: resolveAxis(opts.x),
        y: resolveAxis(opts.y),
        z: opts.z != null ? resolveAxis(opts.z) : undefined,
        w: opts.w != null ? resolveAxis(opts.w) : undefined,
      };
    }
  }

  callback(ev: { value?: unknown }): void {
    const payload: EventPayload = {
      id: this.id,
      isClient: this.isClient,
    };

    if (ev !== undefined && ev.value !== undefined) payload.value = ev.value;

    dispatchEvent(DebugGUICustomEvent.UIEvent, payload);
  }

  createObjValue(): unknown {
    if (this.type === DebugGUIControlType.Button) return this.callback.bind(this);
    if (this.type === DebugGUIControlType.Text) return String(this.defValue ?? "");
    return this.defValue;
  }
}
