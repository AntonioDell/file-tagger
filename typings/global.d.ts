interface Window {
  /** 关闭预加载动画 */
  removeLoading: () => void;
  /** NodeJs fs */
  fs: typeof import("fs");
  /** Electron ipcRenderer */
  ipcRenderer: import("electron").IpcRenderer;
}
