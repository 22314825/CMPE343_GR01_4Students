const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  insertData: (data) => ipcRenderer.send('insert-data', data),
  updateData: (data) => ipcRenderer.send('update-data', data),
  deleteData: (index) => ipcRenderer.send('delete-data', index),
  getData: () => ipcRenderer.send('get-data'),

  // Callbacks from main process to renderer
  handleDataLoaded: (callback) => ipcRenderer.on('data-loaded', (e, data) => callback(data)),
  handleDataUpdated: (callback) => ipcRenderer.on('data-updated', (e, data) => callback(data)),
  handleError: (callback) => ipcRenderer.on('error-message', (e, message) => callback(message))
});
