enum ApiKey {
  GET_ROOT_DIR = "getRootDir",
  GET_TAGGED_FILES = "getTaggedFiles",
  GET_UNTAGGED_FILES = "getUntaggedFiles",
}

const invokeApi = window.apiKey.invokeApi;
/** Get root dir in which tagging takes place. */
export const getRootDirectory = async (): Promise<ApiResponse<FileEntry>> => {
  return invokeApi(ApiKey.GET_ROOT_DIR);
};

/** Get all tagged files */
export const getTaggedFiles = async (): Promise<FileEntry[]> => {
  return invokeApi(ApiKey.GET_TAGGED_FILES);
};

/** Get all untagged files */
export const getUntaggedFiles = async (): Promise<FileEntry[]> => {
  return invokeApi(ApiKey.GET_UNTAGGED_FILES);
};

export interface ApiResponse<T> {
  data?: T;
  error?: Error;
  ok: boolean;
}

export interface FileEntry {
  fullPath: string;
  fileName: string;
  tags?: string[];
}
