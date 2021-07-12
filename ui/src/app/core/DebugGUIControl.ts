import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUICustomEvent from "../enums/DebugGUICustomEvent";
import { EventPayload, dispatchEvent } from "./WebUI";

export type ControlOptionsType = {
  DefValue: any;
  Min: number;
  Max: number;
  Step: number;
  Values: any[];
};

export type VectorOptionsType = {
  DefValue: any;
  x: { Min: number; Max: number; Step?: number };
  y: { Min: number; Max: number; Step?: number };
  z?: { Min: number; Max: number; Step?: number };
  w?: { Min: number; Max: number; Step?: number };
};

export default class DebugGUIControl {
  readonly id: string;
  readonly type: number;
  readonly name: string;
  readonly options: ControlOptionsType | VectorOptionsType;
  readonly isClient: boolean;

  constructor(controlData) {
    this.id = controlData.Id;
    this.type = controlData.Type;
    this.name = controlData.Name;
    this.options = controlData.Options;
    this.isClient = controlData.IsClient;
  }

  /**
   *
   * @param value
   */
  callback(ev) {
    const payload: EventPayload = {
      id: this.id,
      isClient: this.isClient,
    };

    if (ev !== undefined && ev.value !== undefined) payload.value = ev.value;

    dispatchEvent(DebugGUICustomEvent.UIEvent, payload);
  }

  /**
   *
   * @returns
   */
  createObjValue() {
    if (this.type === DebugGUIControlType.Button)
      return this.callback.bind(this);

    if (this.type === DebugGUIControlType.Text)
      return this.options.DefValue.toString();

    return this.options.DefValue;
  }
}
