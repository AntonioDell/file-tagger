enum ApiKey {
  GET_ROOT_DIR = "getRootDir",
  GET_TAGGED_FILES = "getTaggedFiles",
  GET_UNTAGGED_FILES = "getUntaggedFiles",
  SET_FILE_TAGS = "setFileTags",
}

const invokeApi = window.apiKey.invokeApi;

export const getRootDirectory = async (): Promise<ApiResponse<FileEntry>> => {
  return invokeApi(ApiKey.GET_ROOT_DIR);
};

export const getAllFiles = async (): Promise<ApiResponse<FileEntry[]>> => {
  const taggedFilesResponse = await getTaggedFiles();
  const untaggedFilesResponse = await getUntaggedFiles();
  if (!taggedFilesResponse.ok || !untaggedFilesResponse.ok) {
    return !taggedFilesResponse.ok
      ? taggedFilesResponse
      : untaggedFilesResponse;
  }
  return {
    ok: true,
    data: (taggedFilesResponse.data || []).concat(
      untaggedFilesResponse.data || []
    ),
  };
};

export const getTaggedFiles = async (): Promise<ApiResponse<FileEntry[]>> => {
  return invokeApi(ApiKey.GET_TAGGED_FILES);
};

export const getUntaggedFiles = async (): Promise<ApiResponse<FileEntry[]>> => {
  return invokeApi(ApiKey.GET_UNTAGGED_FILES);
};

export const setFileTags = async (
  files: FileEntry[]
): Promise<ApiResponse<FileEntry[]>> => {
  return invokeApi(ApiKey.SET_FILE_TAGS, files);
};

export interface ApiResponse<T> {
  data?: T;
  error?: Error;
  ok: boolean;
}

export interface FileEntry {
  fullPath: string;
  fileName: string;
  meta?: FileMeta;
}

export interface FileMeta {
  tags?: string[];
}
