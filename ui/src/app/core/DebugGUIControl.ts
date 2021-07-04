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
  readonly id: string;
  readonly type: number;
  readonly name: string;
  readonly options: ControlOptions;
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

    // if (this.type === DebugGUIControlType.Vec2D) {
    //   console.log('!!!')
    //   console.log(this.options.DefValue)
    //   return {x: 0, y: 0}
    // }

    if (this.type === DebugGUIControlType.Text)
      return this.options.DefValue.toString();

    return this.options.DefValue;
  }
}
