require "__shared/config"

local mouseDisabled = true

Events:Subscribe("Extension:Loaded", function()
  WebUI:Init()
  Events:Dispatch("DBGUI:RequestControls")
  NetEvents:Send("DBGUI:RequestControls.Net")
end)

Events:Subscribe("Level:Loaded", function()
  Events:Dispatch("DBGUI:RequestControls")
  NetEvents:Send("DBGUI:RequestControls.Net")
end)

Events:Subscribe("Player:UpdateInput", function()
  if InputManager:WentKeyDown(DebugGUIConfig.EnableMKBKey) then
    mouseDisabled = not mouseDisabled

    if mouseDisabled then
      WebUI:ResetMouse()
      WebUI:ResetKeyboard()
    else
      WebUI:EnableMouse()
    end
  end
end)

Events:Subscribe("DBGUI:UIEvent", function(jsonData)
  local data = json.decode(jsonData)

  if data.isClient then
    Events:Dispatch("DBGUI:OnChange", data.id, data.value)
  else
    NetEvents:Send("DBGUI:OnChange.Net", data.id, data.value)
  end
end)

Events:Subscribe("DBGUI:ResetMKB", function(jsonData)
  mouseDisabled = true;

  WebUI:ResetMouse()
  WebUI:ResetKeyboard()
end)

local function OnShow(clear, data)
  if clear then
    WebUI:ExecuteJS("vext.clearControls()")
  end
  WebUI:ExecuteJS("vext.addControls(" .. json.encode(data) ..")")
end

local function ShowUI()
  WebUI:ExecuteJS("vext.showUI()")
end

local function HideUI()
  WebUI:ExecuteJS("vext.hideUI()")
end

Events:Subscribe("DBGUI:ShowUI", ShowUI)
NetEvents:Subscribe("DBGUI:ShowUI", ShowUI)

Events:Subscribe("DBGUI:HideUI", HideUI)
NetEvents:Subscribe("DBGUI:HideUI", HideUI)

local function OnSetValue(id, value)
  WebUI:ExecuteJS("vext.setControlValue(" .. json.encode({id = id, value = value}) .. ")")
end

Events:Subscribe("DBGUI:SetValue", OnSetValue)
NetEvents:Subscribe("DBGUI:SetValue.Net", function(player, id, value)
  OnSetValue(id, value)
end)

Events:Subscribe("DBGUI:Show", OnShow)
NetEvents:Subscribe("DBGUI:Show.Net", OnShow)

local function OnSetVisible(id, visible)
  WebUI:ExecuteJS("vext.setControlVisible(" .. json.encode({id = id, visible = visible}) .. ")")
end

Events:Subscribe("DBGUI:SetVisible", OnSetVisible)
NetEvents:Subscribe("DBGUI:SetVisible.Net", function(id, visible)
  OnSetVisible(id, visible)
end)

local function OnSetDisabled(id, disabled)
  WebUI:ExecuteJS("vext.setControlDisabled(" .. json.encode({id = id, disabled = disabled}) .. ")")
end

Events:Subscribe("DBGUI:SetDisabled", OnSetDisabled)
NetEvents:Subscribe("DBGUI:SetDisabled.Net", function(id, disabled)
  OnSetDisabled(id, disabled)
end)
