// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// Expose some electron/node api to renderer process 
contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
contextBridge.exposeInMainWorld("removeLoading", removeLoading);
