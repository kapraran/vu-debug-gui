import DebugGUIControlType from "../enums/DebugGUIControlType";
import DebugGUICustomEvent from "../enums/DebugGUICustomEvent";
import { EventPayload, dispatchEvent } from "./WebUI";

type ControlOptions = {
  DefValue: any;
  Min: number;
  Max: number;
  Step: number;
  Values: any[];
};

export default class DebugGUIControl {
  private id: string;
  private type: number;
  private name: string;
  private options: ControlOptions;
  private isClient: boolean;

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
  callback(value) {
    const payload: EventPayload = {
      id: this.id,
      isClient: this.isClient,
    };

    if (value !== undefined) payload.value = value;

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

  /**
   *
   * @returns
   */
  getOptions() {
    return this.options;
  }
}
