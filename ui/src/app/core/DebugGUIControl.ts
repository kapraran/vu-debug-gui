import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUICustomEvent from "../enums/DebugGUICustomEvent";
import type { EventPayload } from "./WebUI";
import { dispatchEvent } from "./WebUI";

export type AxisOptions = {
  min?: number;
  max?: number;
  step?: number;
};

export default class DebugGUIControl {
  readonly id: string;
  readonly type: number;
  readonly name: string;
  readonly isClient: boolean;
  readonly defValue: any;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly values?: any[] | Record<string, any>;
  readonly axes?: { x: AxisOptions; y: AxisOptions; z?: AxisOptions; w?: AxisOptions };

  constructor(controlData: Record<string, any>) {
    this.id = controlData.Id;
    this.type = controlData.Type;
    this.name = controlData.Name;
    this.isClient = controlData.IsClient;

    const opts = controlData.Options ?? {};
    this.defValue = opts.DefValue;
    this.min = opts.Min;
    this.max = opts.Max;
    this.step = opts.Step;
    this.values = opts.Values;

    if (opts.x != null) {
      this.axes = {
        x: { min: opts.x.Min, max: opts.x.Max, step: opts.x.Step },
        y: { min: opts.y.Min, max: opts.y.Max, step: opts.y.Step },
      };
      if (opts.z != null) this.axes.z = { min: opts.z.Min, max: opts.z.Max, step: opts.z.Step };
      if (opts.w != null) this.axes.w = { min: opts.w.Min, max: opts.w.Max, step: opts.w.Step };
    }
  }

  callback(ev: { value?: any }) {
    const payload: EventPayload = {
      id: this.id,
      isClient: this.isClient,
    };

    if (ev !== undefined && ev.value !== undefined) payload.value = ev.value;

    dispatchEvent(DebugGUICustomEvent.UIEvent, payload);
  }

  createObjValue() {
    if (this.type === DebugGUIControlType.Button) return this.callback.bind(this);
    if (this.type === DebugGUIControlType.Text) return String(this.defValue ?? "");
    return this.defValue;
  }
}
