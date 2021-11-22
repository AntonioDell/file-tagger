<script setup lang="ts">
import FileContainer from "@/components/FileContainer.vue";
import { FileEntry, getUntaggedFiles, setFileTags } from "@/repository/files";
import { ref, toRaw } from "@vue/reactivity";
import TagSelector from "@/components/TagSelector.vue";

const untaggedFiles = ref<FileEntry[]>([]);
const fileIndex = ref<number>(0);
const currentFile = ref<FileEntry>();
const newTags = ref<string[]>([]);

const reloadUntaggedFiles = async () => {
  const response = await getUntaggedFiles();
  if (response.ok) {
    untaggedFiles.value = response.data || [];
    fileIndex.value = 0;
  } else {
    console.error(response.error);
  }
};

const onChangeFile = (add: number) => {
  let newIndex = fileIndex.value + add;
  if (newIndex < 0) {
    newIndex = untaggedFiles.value.length - 1;
  } else if (newIndex > untaggedFiles.value.length - 1) {
    newIndex = 0;
  }
  if (newTags.value.length === 0) {
    fileIndex.value = newIndex;
    currentFile.value = untaggedFiles.value[newIndex];
  } else {
    const updatedEntry: FileEntry = toRaw(untaggedFiles.value[fileIndex.value]);
    updatedEntry.meta = { tags: toRaw(newTags.value) };
    setFileTags([updatedEntry])
      .then(reloadUntaggedFiles)
      .then(() => {
        newTags.value = [];
        if (newIndex > untaggedFiles.value.length - 1) {
          newIndex = untaggedFiles.value.length - 1;
        }
        currentFile.value = untaggedFiles.value[fileIndex.value];
      });
  }
};

const onTagsChanged = (tags: string[]) => {
  newTags.value = tags;
  onChangeFile(1);
};

reloadUntaggedFiles().then(
  () => (currentFile.value = untaggedFiles.value[fileIndex.value])
);
</script>
<template>
  <div v-if="untaggedFiles.length > 0" class="list">
    <TagSelector
      @tags-changed="onTagsChanged"
      :empty-after-selection="true"
      label="UntaggedFilesView.new_tags_label"
    ></TagSelector>
    <FileContainer
      v-if="currentFile"
      :entry="currentFile"
      :key="currentFile.fullPath"
    ></FileContainer>
    <div class="button-bar">
      <button @click="onChangeFile(-1)">Previous</button>
      <span>{{ fileIndex + 1 }}/{{ untaggedFiles.length }}</span>
      <button @click="onChangeFile(1)">Next</button>
    </div>
  </div>
  <div v-else>Congratulations! All your files are tagged.</div>
</template>
<style>
.list > * {
  margin-bottom: 0.5rem;
}

.button-bar {
  display: flex;
  justify-content: space-evenly;
}
</style>
