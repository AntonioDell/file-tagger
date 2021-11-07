var ApiKey;
(function (ApiKey) {
    ApiKey["GET_ROOT_DIR"] = "getRootDir";
    ApiKey["GET_TAGGED_FILES"] = "getTaggedFiles";
    ApiKey["GET_UNTAGGED_FILES"] = "getUntaggedFiles";
    ApiKey["SET_FILE_TAGS"] = "setFileTags";
})(ApiKey || (ApiKey = {}));
const invokeApi = window.apiKey.invokeApi;
export const getRootDirectory = async () => {
    return invokeApi(ApiKey.GET_ROOT_DIR);
};
export const getTaggedFiles = async () => {
    return invokeApi(ApiKey.GET_TAGGED_FILES);
};
export const getUntaggedFiles = async () => {
    return invokeApi(ApiKey.GET_UNTAGGED_FILES);
};
export const setFileTags = async (files) => {
    return invokeApi(ApiKey.SET_FILE_TAGS, files);
};
//# sourceMappingURL=files.js.map