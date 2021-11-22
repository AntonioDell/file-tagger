const path = require("path");
const { ipcMain } = require("electron");
const {
  getAllFiles,
  getConfig,
  getMetaFileName,
  isMetaFile,
  getMeta,
  writeMeta,
  getTaggedPaths,
} = require("./fileUtils.js");
const { log, trace } = require("console");

const getRootDir = async () => {
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

exports.validChannels = [
  "getRootDir",
  "getTaggedFiles",
  "getUntaggedFiles",
  "setFileTags",
];

exports.setupChannels = () => {
  ipcMain.handle("getRootDir", getRootDir);

  ipcMain.handle("getUntaggedFiles", getUntaggedFiles);

  ipcMain.handle("getTaggedFiles", getTaggedFiles);

  ipcMain.handle("setFileTags", setFileTags);
};
