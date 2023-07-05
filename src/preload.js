const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('fanhuaji', {
  icon: () => ipcRenderer.invoke('fanhuaji.icon'),
  convert: (text) => ipcRenderer.invoke('fanhuaji.convert', text),
})
