var ApiKey;
(function (ApiKey) {
    ApiKey["GET_ROOT_DIR"] = "getRootDir";
    ApiKey["GET_TAGGED_FILES"] = "getTaggedFiles";
    ApiKey["GET_UNTAGGED_FILES"] = "getUntaggedFiles";
})(ApiKey || (ApiKey = {}));
const invokeApi = window.apiKey.invokeApi;
/** Get root dir in which tagging takes place. */
export const getRootDirectory = async () => {
    return invokeApi(ApiKey.GET_ROOT_DIR);
};
/** Get all tagged files */
export const getTaggedFiles = async () => {
    return invokeApi(ApiKey.GET_TAGGED_FILES);
};
/** Get all untagged files */
export const getUntaggedFiles = async () => {
    return invokeApi(ApiKey.GET_UNTAGGED_FILES);
};
//# sourceMappingURL=files.js.map