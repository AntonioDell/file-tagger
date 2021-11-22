const path = require("path");
const { promises: fs } = require("fs");
const { app } = require("electron");
const yaml = require("js-yaml");

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
    return { error, ok: false };
  }
  return config;
};

const createConfig = async (rootPath) => {
  const config = { rootPath };
  const configPath = path.join(app.getPath("userData"), "config.yml");
  try {
    await fs.writeFile(configPath, yaml.dump(config));
  } catch (breakingError) {
    console.error(
      `Unable to write config yaml to path ${configPath}.`,
      breakingError
    );
    return { error: breakingError, ok: false };
  }
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
  const nextDir = nextDirs.pop();
  if (!nextDir) {
    return result;
  }
  return getAllFiles(nextDir, nextDirs, result);
};

const isMetaFile = (fileEntry) => {
  return (
    fileEntry.fileName.startsWith(".") && fileEntry.fileName.endsWith(".meta")
  );
};

const getMetaFileName = (fileEntry) => {
  return `.${fileEntry.fileName}.meta`;
};

const getMeta = async (fileEntry) => {
  const metaFileName = getMetaFileName(fileEntry);
  try {
    const metaFile = await fs.readFile(
      path.join(path.dirname(fileEntry.fullPath), metaFileName),
      {
        encoding: "utf8",
      }
    );
    return yaml.load(metaFile);
  } catch (error) {
    return { tags: [] };
  }
};

const writeMeta = async (fileEntry) => {
  const tags = fileEntry.meta.tags.map((tag) => tag.toLowerCase());
  const metaFilePath = path.join(
    path.dirname(fileEntry.fullPath),
    getMetaFileName(fileEntry)
  );
  if (tags.length === 0) {
    await fs.unlink(metaFilePath);
  } else {
    const meta = {
      ...fileEntry.meta,
      tags,
    };
    const metaFileContent = yaml.dump(meta);
    await fs.writeFile(metaFilePath, metaFileContent);
  }
};

const getTaggedPaths = (allEntries) => {
  return allEntries
    .filter((entry) => isMetaFile(entry))
    .map((entry) => {
      const basePath = entry.fullPath.substring(
        0,
        entry.fullPath.indexOf(entry.fileName)
      );
      return (
        basePath + entry.fileName.substring(1, entry.fileName.indexOf(".meta"))
      );
    });
};

const deleteTagFile = async (entry) => {
  try {
    return fs.unlink(
      path.join(path.dirname(entry.fullPath), getMetaFileName(entry))
    );
  } catch (error) {
    return;
  }
};

module.exports = {
  getMetaFileName,
  isMetaFile,
  getAllFiles,
  getConfig,
  getMeta,
  writeMeta,
  getTaggedPaths,
  createConfig,
  deleteTagFile,
};
