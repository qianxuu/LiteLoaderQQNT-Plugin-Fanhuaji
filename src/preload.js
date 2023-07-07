const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('fanhuaji', {
  getConfig: (dataPath) => ipcRenderer.invoke('fanhuaji.getConfig', dataPath),
  setConfig: (dataPath, converter) => ipcRenderer.invoke('fanhuaji.setConfig', dataPath, converter),
})
