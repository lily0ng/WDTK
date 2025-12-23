const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('webdevkit', {
  version: '0.0.0'
})
