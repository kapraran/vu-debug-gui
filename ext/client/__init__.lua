local mouseEnabled = true

Events:Subscribe('Extension:Loaded', function()
  WebUI:Init()
end)

Events:Subscribe('Player:UpdateInput', function()
  if InputManager:WentKeyDown(InputDeviceKeys.IDK_F1) then
    mouseEnabled = not mouseEnabled

    if mouseEnabled then
      WebUI:ResetMouse()
      WebUI:ResetKeyboard()
    else
      WebUI:EnableMouse()
    end
  end
end)

Events:Subscribe('DBGUI:UIEvent', function(jsonData)
  local data = json.decode(jsonData)

  if data.isClient then
    Events:Dispatch('DBGUI:OnChange', data.id, data.value)
  else
    NetEvents:Send('DBGUI:OnChange.Net', data.id, data.value)
  end
end)

function OnShow(clear, data)
  local dataJson = json.encode(data)
  WebUI:ExecuteJS('vext.addControls(' .. dataJson ..')')
end

Events:Subscribe('DBGUI:Show', OnShow)
NetEvents:Subscribe('DBGUI:Show.Net', OnShow)
