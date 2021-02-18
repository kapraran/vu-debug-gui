import dat from 'dat.gui'

const DebugGUIControlType = {
  Button: 1,
  Checkbox: 2,
  Text: 3,
}

class DebugGUIControl {
  constructor(controlData) {
    this.id = controlData.Id
    this.type = controlData.Type
    this.name = controlData.Name
    this.isClient = controlData.IsClient
  }

  callback(value) {
    console.log(`DebugGUIControl: ${this.id} was clicked`)

    const payload = {
      id: this.id,
      isClient: this.isClient
    }

    if (value !== undefined)
      payload.value = value

    WebUI.Call('DispatchEvent', 'DBGUI:UIEvent', JSON.stringify(payload))
  }

  createObjValue() {
    if (this.type === DebugGUIControlType.Button)
      return this.callback.bind(this)
  }
}


class DebugGUIManager {
  constructor() {
    this.gui = new dat.GUI();
    this.gui.domElement.id = 'dat-gui'

    this.controls = []
    this.datObj = {}
  }

  addControl(controlData) {
    const control = new DebugGUIControl(controlData)
    this.controls.push(control)

    if (controlData.Type == DebugGUIControlType.Button) {
      this.datObj[controlData.Name] = control.createObjValue()
      this.gui.add(this.datObj, controlData.Name)
    }
  }

  addControls(controlsData) {
    for (let control of controlsData)
      this.addControl(control)
  }
}

const manager = new DebugGUIManager()


// const obj = {
//   a: false,
//   b: 2,
//   c: 'Nikos',
//   f: function() {
//     alert(1)
//   }
// }

// const gui = new dat.GUI({ autoPlace: true });
// gui.domElement.id = 'dat-gui'

// gui.add(obj, 'a')
// gui.add(obj, 'b', 0, 100)
// gui.add(obj, 'c')
// gui.add(obj, 'f')

window.vext = {
  addControls: manager.addControls.bind(manager)
}

// vext.addControls([
//   {
//     Id: '12345',
//     Name: 'Btn',
//     Type: 1
//   }
// ])
