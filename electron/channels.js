const path = require("path");
const { promises: fs } = require("fs");
const { app } = require("electron");
const yaml = require("js-yaml");
const { time, timeEnd } = require("console");
import {
  getAllFiles,
  getConfig,
  getMetaFileName,
  isMetaFile,
} from "./fileUtils";

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
