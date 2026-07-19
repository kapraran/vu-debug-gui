---
--- Author:   Nikos Kapraras <nikos@kapraran.dev>
--- URL:      https://github.com/kapraran/vu-debug-gui
--- License:  https://choosealicense.com/licenses/mit/
---

DebugGUIControlType = {
  Button = 1,
  Checkbox = 2,
  Text = 3,
  Range = 4,
  Dropdown = 5,
  Number = 6,
  Vec2 = 7,
  Vec3 = 8,
  Vec4 = 9,
}

function SetDefaultNumOpts(numOpts, skipDefault)
  numOpts = numOpts or {}
  numOpts.min = (numOpts.min ~= nil and numOpts.min) or 0
  numOpts.max = (numOpts.max ~= nil and numOpts.max) or 1
  numOpts.step = numOpts.step

  if not skipDefault then
    numOpts.value = numOpts.value or numOpts.min
  end

  return numOpts
end

-- 
-- DebugGUIControl
-- 

class "DebugGUIControl"

DebugGUIControl.static.OrderIndex = 1

function DebugGUIControl:__init(_type, name, options, callback)
  options = options or {}

  self.id = MathUtils:RandomGuid()
  self.type = _type
  self.name = name
  self.options = options
  self.context = options.context
  self.callback = callback
  self.isClient = SharedUtils:IsClientModule()

  self.lastValue = options.value
  self.__visible = options.visible ~= false
  self.__disabled = options.disabled == true
  self.folder = nil
  self.order = DebugGUIControl.OrderIndex

  DebugGUIControl.static.OrderIndex = DebugGUIControl.OrderIndex + 1
end

function DebugGUIControl:ExecuteCallback(value, player)
  self.lastValue = self:ConvertValue(value)

  if self.callback == nil then
    return
  end

  if self.context == nil then
    self.callback(self.lastValue, player)
  else
    self.callback(self.context, self.lastValue, player)
  end
end

function DebugGUIControl:ConvertValue(value)
  if self.type == DebugGUIControlType.Vec2 then
    return Vec2(value.x, value.y)
  elseif self.type == DebugGUIControlType.Vec3 then
    return Vec3(value.x, value.y, value.z)
  elseif self.type == DebugGUIControlType.Vec4 then
    return Vec4(value.x, value.y, value.z, value.w)
  end

  return value
end

function DebugGUIControl:ValueToSerializable(value)
  if self.type == DebugGUIControlType.Vec2 then
    return {x = value.x, y = value.y}
  elseif self.type == DebugGUIControlType.Vec3 then
    return {x = value.x, y = value.y, z = value.z}
  elseif self.type == DebugGUIControlType.Vec4 then
    return {x = value.x, y = value.y, z = value.z, w = value.w}
  end

  return value
end

function DebugGUIControl:Set(value, player)
  self.lastValue = self:ConvertValue(value)

  local serialized = self:ValueToSerializable(value)
  local idStr = self.id:ToString("D")

  if self.isClient then
    Events:Dispatch("DBGUI:SetValue", idStr, serialized)
  elseif player ~= nil then
    NetEvents:SendTo("DBGUI:SetValue.Net", player, idStr, serialized)
  else
    NetEvents:Broadcast("DBGUI:SetValue.Net", idStr, serialized)
  end
end

function DebugGUIControl:Get()
  return self.lastValue
end

function DebugGUIControl:Dispatch(idStr, eventName, netEventName, ...)
  if self.isClient then
    Events:Dispatch(eventName, idStr, ...)
  else
    NetEvents:Broadcast(netEventName, idStr, ...)
  end
end

function DebugGUIControl:Show()
  if self.__visible then return end
  self.__visible = true
  self:Dispatch(self.id:ToString("D"), "DBGUI:SetVisible", "DBGUI:SetVisible.Net", true)
end

function DebugGUIControl:Hide()
  if not self.__visible then return end
  self.__visible = false
  self:Dispatch(self.id:ToString("D"), "DBGUI:SetVisible", "DBGUI:SetVisible.Net", false)
end

function DebugGUIControl:Toggle()
  if self.__visible then self:Hide() else self:Show() end
end

function DebugGUIControl:SetVisible(visible)
  if type(visible) == "function" then
    self.__visibilityPred = visible
    debugGUIManager:RegisterVisibilityPred(self)
    visible = visible()
  end
  if visible then self:Show() else self:Hide() end
end

function DebugGUIControl:Enable()
  if not self.__disabled then return end
  self.__disabled = false
  self:Dispatch(self.id:ToString("D"), "DBGUI:SetDisabled", "DBGUI:SetDisabled.Net", false)
end

function DebugGUIControl:Disable()
  if self.__disabled then return end
  self.__disabled = true
  self:Dispatch(self.id:ToString("D"), "DBGUI:SetDisabled", "DBGUI:SetDisabled.Net", true)
end

function DebugGUIControl:AsTable()
  return {
    Id = self.id:ToString("D"),
    Type = self.type,
    Name = self.name,
    Folder = self.folder,
    Options = self.options,
    IsClient = self.isClient,
  }
end

-- 
-- DebugGUIManager
-- 

class "DebugGUIManager"

function DebugGUIManager:__init()
  self.controls = {}

  self.__controlsRequested = false
  self.__folderStack = {}
  self.__visibilityPreds = {}

  self:RegisterEvents()
end

function DebugGUIManager:RegisterVisibilityPred(control)
  self.__visibilityPreds[control.id:ToString("D")] = control
end

function DebugGUIManager:EvaluateVisibilityPreds()
  for id, control in pairs(self.__visibilityPreds) do
    if control.__visibilityPred then
      local newVis = control.__visibilityPred()
      if newVis ~= control.__visible then
        if newVis then control:Show() else control:Hide() end
      end
    end
  end
end

function DebugGUIManager:RegisterEvents()
  Events:Subscribe("DBGUI:RequestControls", self, self.OnRequestControls)
  NetEvents:Subscribe("DBGUI:RequestControls.Net", self, self.OnRequestControls)

  if SharedUtils:IsClientModule() then
    Events:Subscribe("DBGUI:OnChange", self, self.OnChange)
  else
    NetEvents:Subscribe("DBGUI:OnChange.Net", self, self.OnChangeNet)
  end
end

function DebugGUIManager:OnChange(id, value, player)
  local control = self.controls[id]

  if control == nil then
    return
  end

  control:ExecuteCallback(value, player)
  self:EvaluateVisibilityPreds()
end

function DebugGUIManager:OnChangeNet(player, id, value)
  self:OnChange(id, value, player)
end

function DebugGUIManager:Add(control)
  if control == nil then
    return nil
  end

  if #self.__folderStack > 0 then
    control.folder = table.concat(self.__folderStack, "/")
  end

  self.controls[control.id:ToString("D")] = control

  if self.__controlsRequested then
    self.__controlsRequested = false
    self:Show(false)
  end

  return control
end

function DebugGUIManager:Folder(name, options, callback)
  options = options or {}
  table.insert(self.__folderStack, name)
  callback(options.context)
  table.remove(self.__folderStack)
end

function DebugGUIManager:OnRequestControls()
  self.__controlsRequested = true
  self:Show(true)
end

function DebugGUIManager:Show(clear)
  if not self.__controlsRequested then
    return
  end

  clear = clear == true

  local controlsOrdered = {}
  for _, control in pairs(self.controls) do
    table.insert(controlsOrdered, control)
  end

  table.sort(controlsOrdered, function(controlA, controlB)
    return controlA.order < controlB.order
  end)

  local data = {}
  for _, control in ipairs(controlsOrdered) do
    table.insert(data, control:AsTable())
  end

  if SharedUtils:IsClientModule() then
    Events:Dispatch("DBGUI:Show", clear, data)
  else
    NetEvents:Broadcast("DBGUI:Show.Net", clear, data)
  end
end

function DebugGUIManager:ShowUI(player)
  if SharedUtils:IsClientModule() then
    Events:Dispatch("DBGUI:ShowUI")
  elseif player ~= nil then
    NetEvents:SendTo("DBGUI:ShowUI", player)
  end
end

function DebugGUIManager:HideUI(player)
  if SharedUtils:IsClientModule() then
    Events:Dispatch("DBGUI:HideUI")
  elseif player ~= nil then
    NetEvents:SendTo("DBGUI:HideUI", player)
  end
end

function DebugGUIManager:Remove(id)
  self.controls[id] = nil
  self.__controlsRequested = true
  self:Show(true)
end

function DebugGUIManager:Clear()
  self.controls = {}
  self.__controlsRequested = true
  self:Show(true)
end

local debugGUIManager = DebugGUIManager()

-- 
-- DebugGUI
-- 

class "DebugGUI"

function DebugGUI.static:Button(name, options, callback)
  local control = DebugGUIControl(
    DebugGUIControlType.Button,
    name,
    options or {},
    callback
  )

  return debugGUIManager:Add(control)
end

function DebugGUI.static:Checkbox(name, options, callback)
  options = options or {}

  local control = DebugGUIControl(
    DebugGUIControlType.Checkbox,
    name,
    options,
    callback
  )

  return debugGUIManager:Add(control)
end

function DebugGUI.static:Text(name, options, callback)
  options = options or {}

  local control = DebugGUIControl(
    DebugGUIControlType.Text,
    name,
    options,
    callback
  )

  return debugGUIManager:Add(control)
end

function DebugGUI.static:Number(name, options, callback)
  options = options or {}
  options = SetDefaultNumOpts(options)

  local control = DebugGUIControl(
    DebugGUIControlType.Number,
    name,
    options,
    callback
  )

  return debugGUIManager:Add(control)
end

function DebugGUI.static:Range(name, options, callback)
  options = options or {}
  options = SetDefaultNumOpts(options)

  local control = DebugGUIControl(
    DebugGUIControlType.Range,
    name,
    options,
    callback
  )

  return debugGUIManager:Add(control)
end

function DebugGUI.static:Dropdown(name, options, callback)
  options = options or {}

  if options.values == nil then
    error("Dropdown requires a values table")
  end

  if options.value == nil then
    if type(options.values) == 'table' and options.values[1] ~= nil then
      options.value = options.values[1]
    else
      for _, v in pairs(options.values) do
        options.value = v
        break
      end
    end
  end

  local control = DebugGUIControl(
    DebugGUIControlType.Dropdown,
    name,
    options,
    callback
  )

  return debugGUIManager:Add(control)
end

function DebugGUI.static:Vector(name, options, callback)
  options.x = SetDefaultNumOpts(options.x, true)
  options.y = SetDefaultNumOpts(options.y, true)

  if options.type ~= DebugGUIControlType.Vec2 then
    options.z = SetDefaultNumOpts(options.z, true)
  end
  if options.type == DebugGUIControlType.Vec4 then
    options.w = SetDefaultNumOpts(options.w, true)
  end

  local controlType = options.type
  options.type = nil

  local control = DebugGUIControl(
    controlType,
    name,
    options,
    callback
  )

  return debugGUIManager:Add(control)
end

function DebugGUI.static:Vec2(name, options, callback)
  options = options or {}
  if options.value == nil then options.value = Vec2(0, 0) end
  options.type = DebugGUIControlType.Vec2

  return self:Vector(name, options, callback)
end

function DebugGUI.static:Vec3(name, options, callback)
  options = options or {}
  if options.value == nil then options.value = Vec3(0, 0, 0) end
  options.type = DebugGUIControlType.Vec3

  return self:Vector(name, options, callback)
end

function DebugGUI.static:Vec4(name, options, callback)
  options = options or {}
  if options.value == nil then options.value = Vec4(0, 0, 0, 0) end
  options.type = DebugGUIControlType.Vec4

  return self:Vector(name, options, callback)
end

function DebugGUI.static:Print(str)
end

function DebugGUI.static:Folder(name, options, callback)
  debugGUIManager:Folder(name, options, callback)
end

function DebugGUI.static:Remove(id)
  debugGUIManager:Remove(id)
end

function DebugGUI.static:Clear()
  debugGUIManager:Clear()
end

function DebugGUI.static:Show(clear)
  debugGUIManager:Show(clear)
end

function DebugGUI.static:ShowUI(player)
  debugGUIManager:ShowUI(player)
end

function DebugGUI.static:HideUI(player)
  debugGUIManager:HideUI(player)
end
