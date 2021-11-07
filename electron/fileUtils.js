const path = require("path");
const { promises: fs } = require("fs");
const { app } = require("electron");
const yaml = require("js-yaml");
const { time, timeEnd } = require("console");
export const getConfig = async () => {
    const userDataPath = app.getPath("userData");
    const configPath = path.join(userDataPath, "config.yml");
    let config;
    try {
        const configFile = await fs.readFile(configPath, {
            encoding: "utf8",
        });
        config = yaml.load(configFile);
    }
    catch (error) {
        // TODO: Remove test code
        config = { rootPath: path.join(app.getPath("home"), "test") };
        try {
            await fs.writeFile(configPath, yaml.dump(config));
        }
        catch (breakingError) {
            console.error(`Unable to write config yaml to path ${configPath}.`, breakingError);
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
export const getAllFiles = async (currentDir, nextDirs = [], result = []) => {
    const dir = await fs.opendir(currentDir);
    for await (const file of dir) {
        if (file.isDirectory()) {
            nextDirs.push(path.join(dir.path, file.name));
        }
        else {
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
export const isMetaFile = (fileEntry) => {
    return (fileEntry.fileName.startsWith(".") && fileEntry.fileName.endsWith(".meta"));
};
export const getMetaFileName = (fileEntry) => {
    return `.${fileEntry.fileName}.meta`;
};
//# sourceMappingURL=fileUtils.js.map