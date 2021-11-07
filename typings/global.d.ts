interface Window {
  /** 关闭预加载动画 */
  apiKey: {
    invokeApi(channel: string, ...args: any[]): Promise<any>;
  };
  /** NodeJs fs */
  fs: typeof import("fs");
  /** Electron ipcRenderer */
  ipcRenderer: import("electron").IpcRenderer;
}
