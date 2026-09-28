/**
 * electron/preload.js
 * Cầu nối an toàn giữa Electron và giao diện Web (Context Bridge)
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  closeApp: () => ipcRenderer.send('app-close'),
  minimizeToTray: () => ipcRenderer.send('app-minimize-tray')
});

