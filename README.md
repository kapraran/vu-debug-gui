# Venice Unleashed DebugGUI

Venice Unleashed DebugGUI is a simple framework to easily create debug controls from both your client and server scripts, instead of relying only on Console/Chat/RCON or having to create custom WebUI controls for every new project.

## Example

In the following example, you can see how easy is to create a number of controls

```lua
require "__shared/DebugGUI"

-- A button to move to the next round
DebugGUI:Button("Next Round", function()
  RCON:SendCommand("mapList.runNextRound")
end)

-- A folder that contains player related controls
DebugGUI:Folder("Player", function ()
  -- A button to kill the local player
  DebugGUI:Button("Suicide", function(value, player)
    if player ~= nil and player.soldier ~= nil then
      player.soldier:Kill()
    end
  end)

  -- A range slider to adjust player's health
  DebugGUI:Range("Health", {Min = 0, Max = 100}, function(value, player)
    if player ~= nil and player.soldier ~= nil then
      player.soldier.health = value
    end
  end)
end)

```

## Supported Controls

```
DebugGUI:Button(name, context, callback)
```

```
DebugGUI:Checkbox(name, defValue, context, callback)
```

```
DebugGUI:Text(name, defValue, context, callback)
```

```
DebugGUI:Range(name, options, context, callback)
```

```
DebugGUI:Dropdown(name, options, context, callback)
```

## Usage

