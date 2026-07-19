# Venice Unleashed DebugGUI

A framework for creating debug controls from your client and server scripts. The WebUI is included.

![](./.github/debug-gui-screen.webp)

Find the latest version (with the prebuilt UI) on the [releases page](https://github.com/kapraran/vu-debug-gui/releases).

## Quick Start

1. Add this mod to your server's `ModList`.
2. Copy `ext/shared/DebugGUI.lua` into your mod's `ext/shared/` folder.
3. `require "__shared/DebugGUI"` at the top of your scripts.
4. Press **F1** in-game to toggle the panel.

```lua
require "__shared/DebugGUI"

DebugGUI:Button("Next Round", {}, function(value, player)
  RCON:SendCommand("mapList.runNextRound")
end)

DebugGUI:Folder("Player", {}, function(self)
  self:Button("Suicide", {}, function(value, player)
    if player ~= nil and player.soldier ~= nil then
      player.soldier:Kill()
    end
  end)

  self:Range("Health", { value = 100, min = 0, max = 100 }, function(value, player)
    if player ~= nil and player.soldier ~= nil then
      player.soldier.health = value
    end
  end)
end)
```

All controls use the same signature: `DebugGUI:<Type>(name, options, callback)`.

## API Reference

Every method returns a control or container instance (see [Reading and Writing Values](#reading-and-writing-values)).

### Quick Reference

| Method | Description |
|--------|-------------|
| [`Button`](#button) | Fires callback on click |
| [`Checkbox`](#checkbox) | True/false toggle |
| [`Text`](#text) | Free-text input |
| [`Number`](#number) | Numeric input with min/max/step |
| [`Range`](#range-slider) | Slider with min/max/step |
| [`Dropdown`](#dropdown) | Selection from a list |
| [`Vec2 / Vec3 / Vec4`](#vec2--vec3--vec4) | Vector input with per-axis constraints |
| [`Folder`](#folder) | Collapsible group of controls |
| [`Tab`](#tab) | Tabbed section (pages hidden until selected) |
| [`Row`](#row) | Horizontal row layout |
| [`CreatePanel`](#createpanel) | Independent floating panel |
| [`Remove(id)`](#remove) | Remove a control by GUID |
| [`Clear()`](#clear) | Remove all controls |

### Callback Signature

When a control's value changes, your callback fires:

- **Without context:** `callback(value, player)`
- **With context:** `callback(context, value, player)`

`player` is the triggering player when the control was created on the **server**. It is `nil` for client-side controls.

### Container Pattern

Every container (Folder, Tab, Row) follows the same pattern — it returns a reference and optionally calls a callback with it:

```lua
-- Callback style
local folder = DebugGUI:Folder("Settings", {}, function(self)
  self:Range("Volume", { value = 50 })
end)

-- Outside callback — same reference
folder:Range("Brightness", { value = 80 })
folder:Checkbox("Fullscreen", { value = true })
```

### Button

```lua
DebugGUI:Button(name, options, callback)
```

```lua
DebugGUI:Button("Heal All", {}, function(value, player)
  -- value is nil for buttons
end)
```

Options:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `context` | any | `nil` | Passed as first arg to callback |
| `tooltip` | string | `nil` | Help text on hover |
| `icon` | string | `nil` | Icon name from SVG registry (e.g. `"Play"`, `"Trash"`) |
| `visible` | bool | `true` | Initial visibility |
| `disabled` | bool | `false` | Gray out, prevent interaction |

### Checkbox

```lua
DebugGUI:Checkbox(name, options, callback)
```

```lua
DebugGUI:Checkbox("God Mode", { value = false }, function(value, player)
  if player ~= nil and player.soldier ~= nil then
    player.soldier:SetHealthRecharge(value and 999 or 1)
  end
end)
```

### Text

```lua
DebugGUI:Text(name, options, callback)
```

```lua
DebugGUI:Text("Say Message", { value = "" }, function(value, player)
  if value ~= "" then
    ChatManager:Yell(value, 5)
  end
end)
```

### Number

```lua
DebugGUI:Number(name, options, callback)

options = {
  value      -- initial value (defaults to min)
  min        -- (0)
  max        -- (1)
  step       -- (nil, free input)
  format     -- printf-style string (e.g. "%.2f")
  validate   -- function(value) -> bool, errorMsg
}
```

```lua
DebugGUI:Number("Multiplier", { value = 1.0 }, function(value, player) end)

DebugGUI:Number("Tickets", { value = 200, min = 0, max = 1000 }, function(value, player) end)
```

### Range (Slider)

```lua
DebugGUI:Range(name, options, callback)

options = {
  value      -- initial value (defaults to min)
  min        -- (0)
  max        -- (100)
  step       -- (1)
  format     -- printf-style string (e.g. "%.0f%%")
  live       -- bool, fire callback on every drag tick (not just release)
  tooltip    -- help text on hover
}
```

```lua
DebugGUI:Range("Speed", { value = 1.0, min = 0.1, max = 5.0, step = 0.1 }, function(value, player)
  if player ~= nil and player.soldier ~= nil then
    player.soldier.soldierData.visualUnlock.maxSpeed = value
  end
end)
```

### Dropdown

```lua
DebugGUI:Dropdown(name, options, callback)

options = {
  values     -- REQUIRED. Array of values or table mapping labels to values
  value      -- initial value (defaults to first element of values)
}
```

```lua
-- Array: display equals stored value
DebugGUI:Dropdown("Map", { values = {"Caspian Border", "Operation Metro"} }, function(value, player)
  print(value)
end)

-- Key-value: different display label and stored value
DebugGUI:Dropdown("Quality", { values = { Low = 128, Medium = 256, High = 512 }, value = 256 }, function(value, player)
  print(value)  -- 128, 256, or 512
end)
```

### Vec2 / Vec3 / Vec4

```lua
DebugGUI:Vec2(name, options, callback)
DebugGUI:Vec3(name, options, callback)
DebugGUI:Vec4(name, options, callback)

options = {
  value = Vec2(0, 0),         -- initial value
  x = { min = 0, max = 1 },   -- axis constraints
  y = { min = 0, max = 1 },
  z = { min = 0, max = 1 },   -- Vec3/Vec4 only
  w = { min = 0, max = 1 },   -- Vec4 only
}
```

```lua
DebugGUI:Vec3("Position", { value = Vec3(0, 50, 0),
  x = { min = -100, max = 100, step = 1 },
  y = { min = 0,   max = 200, step = 1 },
  z = { min = -100, max = 100, step = 1 },
}, function(value, player)
  -- value is a Vec3
end)
```

### Folder

```lua
DebugGUI:Folder(name, options, callback)
```

Groups controls under a collapsible section. Returns a container ref. Folders can be nested arbitrarily.

```lua
local f = DebugGUI:Folder("Weapons", {}, function(self)
  self:Range("Damage", { value = 25, min = 0, max = 100 })

  self:Folder("Primary", {}, function(self)
    self:Range("Fire Rate", { value = 600, min = 100, max = 1200 })
  end)
end)

-- Add more controls later
f:Checkbox("Auto Reload", { value = false })
```

### Tab

```lua
DebugGUI:Tab(name, options, callback)
```

Creates a tabbed section. Multiple tabs at the same level render as a tab bar; only one tab's content is visible at a time. Tabs can contain folders, rows, and other tabs.

```lua
DebugGUI:Tab("Combat", {}, function(tab)
  tab:Range("Damage", { value = 25, min = 0, max = 100 })
  tab:Checkbox("Headshots Only", { value = false })
end)

DebugGUI:Tab("Movement", {}, function(tab)
  tab:Range("Speed", { value = 1, min = 0.1, max = 5 })
  tab:Checkbox("Infinite Sprint", { value = false })
end)
```

### Row

```lua
DebugGUI:Row(options, callback)
```

Lays out controls side-by-side in a horizontal row. Each child gets equal width (`flex: 1`).

```lua
-- Without title
DebugGUI:Row(function(row)
  row:Button("Play", {})
  row:Button("Pause", {})
  row:Button("Stop", {})
end)

-- With title label
DebugGUI:Row({ title = "Position" }, function(row)
  row:Number("X", { value = 0 })
  row:Number("Y", { value = 0 })
  row:Number("Z", { value = 0 })
end)
```

### CreatePanel

```lua
DebugGUI:CreatePanel(name, options, callback)
```

Creates an independent floating panel at a screen corner. The returned panel handle has `Show()`, `Hide()`, and `Destroy()` methods in addition to all control factory methods.

```lua
local panel = DebugGUI:CreatePanel("Physics", {
  position = "bottom-left",
  width = 350,
}, function(self)
  self:Range("Gravity", { value = -9.81, min = -20, max = 0 })
  self:Range("Friction", { value = 0.5, min = 0, max = 1 })
end)

panel:Range("Drag", { value = 0.1, min = 0, max = 1 })
panel:Hide()
panel:Show()
panel:Destroy()
```

`position` accepts: `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`.

## Reading and Writing Values

Every control method returns a `DebugGUIControl` instance.

### Get

```lua
local healthSlider = DebugGUI:Range("Health", { value = 100 }, function(value, player)
  if player ~= nil and player.soldier ~= nil then
    player.soldier.health = value
  end
end)

local currentHealth = healthSlider:Get()
```

### Set

```lua
local healthSlider = DebugGUI:Range("Health", { value = 100 })
healthSlider:Set(50)  -- slider jumps to 50 in the UI, no callback fires
```

For vector controls, pass a `Vec2`, `Vec3`, or `Vec4`:

```lua
local posControl = DebugGUI:Vec3("Position", { value = Vec3(0, 0, 0) })
posControl:Set(Vec3(100, 200, 300))
```

Server-side `:Set()` broadcasts to all clients. Pass a player to target one:

```lua
healthSlider:Set(50, specificPlayer)  -- only this player sees the change
```

## Enhanced Control Properties

All controls accept these common options:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `tooltip` | string | `nil` | Help text shown on hover (`?` icon) |
| `visible` | bool | `true` | Initial visibility |
| `disabled` | bool | `false` | Gray out, prevent interaction |
| `context` | any | `nil` | Passed as first arg to callback |

### Tooltip

```lua
DebugGUI:Range("Gravity", {
  value = -9.81, min = -20, max = 0,
  tooltip = "Vertical acceleration in m/s².\nEarth standard: -9.81",
})
```

### Visibility

Controls can be shown/hidden programmatically, including conditionally based on another control's value.

```lua
local godMode = DebugGUI:Checkbox("God Mode", { value = false })

local healthMult = DebugGUI:Range("Health Multiplier", {
  value = 1, min = 0.1, max = 10,
  visible = false,
})

healthMult:Show()
healthMult:Hide()
healthMult:Toggle()
```

### Disabled

```lua
local grav = DebugGUI:Number("Gravity", { value = -9.81, disabled = true })
grav:Enable()
grav:Disable()
```

### Format

Numeric controls can display formatted values:

```lua
DebugGUI:Range("Angle", { value = 45, min = 0, max = 360, format = "%.0f°" })
DebugGUI:Range("Speed", { value = 100, format = function(v) return string.format("%.1f m/s", v) end })
```

### Button Icons

Buttons can display an SVG icon from a built-in registry (150+ icons):

```lua
DebugGUI:Button("Save", { icon = "FloppyDisk" })
DebugGUI:Button("Delete", { icon = "Trash", context = "targetPlayer" }, function(context, value, player)
  RCON:SendCommand("admin.kick " .. context)
end)
```

## Managing Controls

### Remove

```lua
DebugGUI:Remove(id)
```

```lua
local btn = DebugGUI:Button("Temp", {}, function() end)
local id = btn:AsTable().Id

-- later
DebugGUI:Remove(id)
```

### Clear

```lua
DebugGUI:Clear()
```

Removes every control and wipes all panels.

## UI Visibility

```lua
DebugGUI:ShowUI()   -- show the panel programmatically
DebugGUI:HideUI()   -- hide the panel programmatically
```

On the **server**, pass a player to target a specific client:

```lua
DebugGUI:ShowUI(player)
DebugGUI:HideUI(player)
```

## Configuration

Edit `ext/shared/config.lua`:

```lua
DebugGUIConfig = {
  EnableMKBKey = InputDeviceKeys.IDK_F1,   -- key to toggle mouse capture
}
```

## Development

To customize the WebUI, edit files in `ui/` then rebuild:

```bash
cd ui
npm ci
npm run build
```

The output goes to `ui/dist/` and is bundled into `ui.vuic`.

## Limitations

- **No automatic sync.** When a control changes game state, you must sync that change to other clients yourself.
- **Controls persist across level loads.** The mod clears them on `Level:Loaded`, but if your mod creates them dynamically based on map state, re-register them on level change.
- **Server-side controls are visible to all clients.** Client-side controls only appear for that client.

## License

[MIT](https://choosealicense.com/licenses/mit/)
