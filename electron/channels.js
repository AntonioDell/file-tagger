const path = require("path");
const { ipcMain } = require("electron");
const {
  getAllFiles,
  getConfig,
  getMetaFileName,
  isMetaFile,
  getMeta,
  writeMeta,
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
  const taggedFileNames = fileEntries
    .filter((entry) => isMetaFile(entry))
    .map((entry) => {
      return entry.fileName.substring(1, entry.fileName.indexOf(".meta"));
    });
  const untaggedEntries = fileEntries
    .filter((entry) => !taggedFileNames.includes(entry.fileName))
    .filter((entry) => !isMetaFile(entry));
  trace(untaggedEntries);
  return { data: untaggedEntries, ok: true };
};

const getTaggedFiles = async () => {
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
        const meta = await getMeta(entry);

        return { ...entry, meta };
      })
  );
  trace(taggedEntries);
  return { data: taggedEntries, ok: true };
};

const setFileTags = async (event, ...args) => {
  if (args.length === 0) {
    return;
  }
  const fileEntries = args[0];
  await Promise.all(
    fileEntries.forEach((entry) => {
      writeMeta(entry);
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
