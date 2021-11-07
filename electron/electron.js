// electron/electron.js
const path = require("path");
const { promises: fs } = require("fs");
const { app, BrowserWindow, ipcMain } = require("electron");
const yaml = require("js-yaml");
const { time, timeEnd } = require("console");

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const getConfig = async () => {
  const userDataPath = app.getPath("userData");
  const configPath = path.join(userDataPath, "config.yml");
  let config;
  try {
    const configFile = await fs.readFile(configPath, {
      encoding: "utf8",
    });
    config = yaml.load(configFile);
  } catch (error) {
    // TODO: Remove test code
    config = { rootPath: path.join(app.getPath("home"), "test") };
    try {
      await fs.writeFile(configPath, yaml.dump(config));
    } catch (breakingError) {
      console.error(
        `Unable to write config yaml to path ${configPath}.`,
        breakingError
      );
      return { error: breakingError, ok: false };
    }
  }
  return config;
};

/**
 *
 * @param {String} currentDir Path of the current directory
 * @param {String[]} nextDirs Paths of all directories, that need to be traversed
 * @param {[]} result FileEntry list
 * @returns {Promise<[]>}
 */
const getAllFiles = async (currentDir, nextDirs = [], result = []) => {
  const dir = await fs.opendir(currentDir);
  for await (const file of dir) {
    if (file.isDirectory()) {
      nextDirs.push(path.join(dir.path, file.name));
    } else {
      result.push({
        fullPath: path.join(dir.path, file.name),
        fileName: file.name,
      });
    }
  }
  if (nextDirs.length == 0) {
    return result;
  }
  return getAllFiles(nextDirs.pop(), nextDirs, result);
};

const isMetaFile = (fileEntry) => {
  return (
    fileEntry.fileName.startsWith(".") && fileEntry.fileName.endsWith(".meta")
  );
};

const getMetaFileName = (fileEntry) => {
  return `.${fileEntry.fileName}.meta`;
};

ipcMain.handle("getRootDir", async (event, ...arg) => {
  const config = await getConfig();
  if (config.error) {
    return config;
  }
  return {
    data: {
      fullPath: config.rootPath,
      fileName: path.basename(config.rootPath),
    },
    ok: true,
  };
});

ipcMain.handle("getUntaggedFiles", async () => {
  const config = await getConfig();
  if (config.error) {
    return config;
  }
  const fileEntries = await getAllFiles(config.rootPath);
  const taggedFileNames = fileEntries
    .filter(
      (entry) =>
        entry.fileName.startsWith(".") && entry.fileName.endsWith(".meta")
    )
    .map((entry) => {
      return entry.fileName.substring(1, entry.fileName.indexOf(".meta"));
    });
  const untaggedEntries = fileEntries
    .filter((entry) => !taggedFileNames.includes(entry.fileName))
    .filter(
      (entry) =>
        !(entry.fileName.startsWith(".") && entry.fileName.endsWith(".meta"))
    );
  console.log(untaggedEntries);
  return untaggedEntries;
});

ipcMain.handle("getTaggedFiles", async () => {
  const config = await getConfig();
  if (config.error) {
    return config;
  }
  const fileEntries = await getAllFiles(config.rootPath);
  const metaFileEntries = fileEntries.filter((entry) => isMetaFile(entry));
  const taggedFileNames = metaFileEntries.map((entry) => {
    return entry.fileName.substring(1, entry.fileName.indexOf(".meta"));
  });

  const taggedEntries = await Promise.all(
    fileEntries
      .filter(
        (entry) => taggedFileNames.includes(entry.fileName) || isMetaFile(entry)
      )
      .filter((entry) => !isMetaFile(entry))
      .map(async (entry) => {
        const metaFileName = getMetaFileName(entry);
        const metaFile = await fs.readFile(
          path.join(path.dirname(entry.fullPath), metaFileName),
          {
            encoding: "utf8",
          }
        );
        const meta = yaml.load(metaFile);
        const tags = meta.tags || [];

        return { ...entry, tags };
      })
  );
  return taggedEntries;
});
