const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('fanhuaji', {
  convert: (text) => ipcRenderer.invoke('fanhuaji.convert', text),
})
