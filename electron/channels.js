const { ipcMain, dialog } = require("electron");
const {
  getAllFiles,
  getConfig,
  isMetaFile,
  getMeta,
  writeMeta,
  getTaggedPaths,
  createConfig,
  deleteTagFile,
} = require("./fileUtils.js");

const getRootDir = async () => {
  const config = await getConfig();
  if (config.error) {
    return config;
  }
  return {
    data: config.rootPath,
    ok: true,
  };
};

const getUntaggedFiles = async () => {
  const config = await getConfig();
  if (config.error) {
    return config;
  }
  const fileEntries = await getAllFiles(config.rootPath);
  const taggedPaths = getTaggedPaths(fileEntries);
  const untaggedEntries = fileEntries
    .filter((entry) => !taggedPaths.includes(entry.fullPath))
    .filter((entry) => !isMetaFile(entry));
  return { data: untaggedEntries, ok: true };
};

const getTaggedFiles = async () => {
  const config = await getConfig();
  if (config.error) {
    return config;
  }
  const fileEntries = await getAllFiles(config.rootPath);
  const taggedPaths = getTaggedPaths(fileEntries);
  const taggedEntries = await Promise.all(
    fileEntries
      .filter((entry) => taggedPaths.includes(entry.fullPath))
      .map(async (entry) => {
        const meta = await getMeta(entry);
        return { ...entry, meta };
      })
  );
  return { data: taggedEntries, ok: true };
};

const setFileTags = async (event, ...args) => {
  if (args.length === 0) {
    return;
  }
  const fileEntries = args[0];
  await Promise.all(
    fileEntries.map((entry) => {
      return writeMeta(entry);
    })
  );
  return;
};

const selectRootDir = async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory", "showHiddenFiles"],
  });
  if (result.canceled) {
    return { data: "", ok: true };
  }
  const rootPath = result.filePaths[0];
  createConfig(rootPath);
  return { data: rootPath, ok: true };
};

const removeAllTags = async () => {
  const config = await getConfig();
  if (config.error) {
    return config;
  }
  const fileEntries = await getAllFiles(config.rootPath);
  await Promise.all(
    fileEntries
      .filter((entry) => !isMetaFile(entry))
      .map((entry) => deleteTagFile(entry))
  );
  return { ok: true };
};

exports.validChannels = [
  "getRootDir",
  "getTaggedFiles",
  "getUntaggedFiles",
  "setFileTags",
  "selectRootDir",
  "removeAllTags",
];

exports.setupChannels = () => {
  ipcMain.handle("getRootDir", getRootDir);

  ipcMain.handle("getUntaggedFiles", getUntaggedFiles);

  ipcMain.handle("getTaggedFiles", getTaggedFiles);

  ipcMain.handle("setFileTags", setFileTags);

  ipcMain.handle("selectRootDir", selectRootDir);

  ipcMain.handle("removeAllTags", removeAllTags);
};
