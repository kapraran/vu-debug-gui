import dat from 'dat.gui'

const DebugGUIControlType = {
  Button: 1,
  Checkbox: 2,
  Text: 3,
  Range: 4
}

function attackInputListener() {
  Array.from(document.querySelectorAll('input')).forEach(el => {
    console.log('found el')
    el.addEventListener('focus', enableKeyboard)
    el.addEventListener('blur', disableKeyboard)
  })
}

function enableKeyboard() {
  console.log('EnableKeyboard')
  WebUI.Call('EnableKeyboard')
}

function disableKeyboard() {
  console.log('ResetKeyboard')
  WebUI.Call('ResetKeyboard')
}

class DebugGUIControl {
  constructor(controlData) {
    this.id = controlData.Id
    this.type = controlData.Type
    this.name = controlData.Name
    this.options = controlData.Options
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

    return this.options.DefValue
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
    this.datObj[controlData.Name] = control.createObjValue()

    if (controlData.Type == DebugGUIControlType.Button) {
      this.gui.add(this.datObj, controlData.Name)
    }

    if (controlData.Type == DebugGUIControlType.Range) {
      this
      .gui
      .add(this.datObj, controlData.Name, control.options.Min, control.options.Max, control.options.Step)
      .onChange(control.callback.bind(control))

      attackInputListener()
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
//     Name: 'rng',
//     Type: 4,
//     Options: {
//       DefValue: 33,
//       Min: 0,
//       Max: 100,
//       Step: 1
//     }
//   }
// ])
