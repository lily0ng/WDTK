const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('webdevkit', {
  version: '0.0.0',
  serviceUrl: process.env.WEBDEVKIT_SERVICE_URL || 'http://127.0.0.1:3001'
})
