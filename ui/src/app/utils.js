export const enableKeyboard = () => {
  console.log('EnableKeyboard')
  WebUI.Call('EnableKeyboard')
}

export const resetKeyboard = () => {
  console.log('ResetKeyboard')
  WebUI.Call('ResetKeyboard')
}
