DebugGUIControlType = {
  Button = 1,
  Checkbox = 2,
  Text = 3,
  Range = 4
}

-- 
-- DebugGUIControl
-- 

class "DebugGUIControl"

function DebugGUIControl:__init(_type, name, folder, options, context, callback)
  if callback == nil then
    callback = context
    context = nil
  end

  self.id = MathUtils:RandomGuid()
  self.type = _type
  self.name = name
  self.folder = folder
  self.options = options
  self.context = context
  self.callback = callback
  self.isClient = SharedUtils:IsClientModule()
end

function DebugGUIControl:ExecuteCallback(value, player)
  if self.callback == nil then
    return
  end

  if self.context == nil then
    self.callback(value, player)
  else
    self.callback(self.context, value, player)
  end
end

function DebugGUIControl:AsTable()
  return {
    Id = self.id:ToString('D'),
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
  self.__addInFolder = nil

  self:RegisterEvents()
end

function DebugGUIManager:RegisterEvents()
  Events:Subscribe('Level:Loaded', self, self.Show)

  if SharedUtils:IsClientModule() then
    Events:Subscribe('DBGUI:OnChange', self, self.OnChange)
  else
    NetEvents:Subscribe('DBGUI:OnChange.Net', self, self.OnChangeNet)
  end
end

function DebugGUIManager:OnChange(id, value, player)
  local control = self.controls[id]

  if control == nil then
    return
  end

  control:ExecuteCallback(value, player)
end

function DebugGUIManager:OnChangeNet(player, id, value)
  self:OnChange(id, value, player)
end

function DebugGUIManager:Add(control)
  if control == nil then
    return
  end

  if self.__addInFolder ~= nil then
    control.folder = self.__addInFolder
  end

  self.controls[control.id:ToString('D')] = control
end

function DebugGUIManager:Folder(name, context, callback)
  -- avoid nested folders
  if self.__addInFolder ~= nil then
    return
  end

  -- swap callback-context if needed
  if callback == nil then
    if context == nil then
      return
    end

    callback = context
    context = nil
  end

  self.__addInFolder = name
  callback(context)
  self.__addInFolder = nil
end

function DebugGUIManager:Show(clear)
  clear = not (not clear)

  local data = {}
  for id, control in pairs(self.controls) do
    table.insert(data, control:AsTable())
  end

  if SharedUtils:IsClientModule() then
    Events:Dispatch('DBGUI:Show', clear, data)
  else
    NetEvents:Broadcast('DBGUI:Show.Net', clear, data)
  end
end

local debugGUIManager = DebugGUIManager()

-- 
-- DebugGUI
-- 

class "DebugGUI"

function DebugGUI.static:Button(name, context, callback)
  local control = DebugGUIControl(
    DebugGUIControlType.Button,
    name,
    nil,
    nil,
    context,
    callback
  )

  debugGUIManager:Add(control)
end

function DebugGUI.static:Checkbox(name, defValue, context, callback)
  local control = DebugGUIControl(
    DebugGUIControlType.Checkbox,
    name,
    nil,
    {
      DefValue = defValue
    },
    context,
    callback
  )

  debugGUIManager:Add(control)
end

function DebugGUI.static:Text(name, defValue, context, callback)
  local control = DebugGUIControl(
    DebugGUIControlType.Text,
    name,
    nil,
    {
      DefValue = defValue
    },
    context,
    callback
  )

  debugGUIManager:Add(control)
end

function DebugGUI.static:Range(name, options, context, callback)
  options = options or {}

  -- defaults
  options.Min = (options.Min ~= nil and options.Min) or 0
  options.Max = (options.Max ~= nil and options.Max) or 100
  options.Step = (options.Step ~= nil and options.Step) or 1
  options.DefValue = options.DefValue or options.Min

  local control = DebugGUIControl(
    DebugGUIControlType.Range,
    name,
    nil,
    options,
    context,
    callback
  )

  debugGUIManager:Add(control)
end

function DebugGUI.static:Print(str)
  -- TODO
end

function DebugGUI.static:Show(clear)
  debugGUIManager:Show(clear)
end
