<script setup lang="ts">
import FileContainer from "@/components/FileContainer.vue";
import TagSelector from "@/components/TagSelector.vue";
import { FileEntry, getAllFiles, setFileTags } from "@/repository/files";
import { computed, ref, toRaw } from "@vue/reactivity";
import { useI18n } from "vue-i18n";

const filters = ref<string[]>([]);

const allFiles = ref<FileEntry[]>([]);

const filteredFiles = computed(() => {
  if (filters.value.length == 0) {
    return allFiles.value;
  }
  console.log(toRaw(allFiles.value));
  return allFiles.value.filter((file) =>
    filters.value.every((filter) =>
      file.meta?.tags?.includes(filter.toLowerCase())
    )
  );
});
const setFilters = (newFilters: string[]) => {
  filters.value = newFilters;
};
const reloadEntries = async () => {
  const response = await getAllFiles();
  if (response.ok) {
    allFiles.value = response.data || [];
  }
};
reloadEntries();
const onTagDeleted = (entry: FileEntry, deletedTag: String) => {
  const updatedEntry = {
    ...entry,
    meta: {
      ...entry.meta,
      tags: entry.meta?.tags?.filter(
        (existingTag) => existingTag !== deletedTag
      ),
    },
  };
  setFileTags([updatedEntry]).then(reloadEntries);
};

const { t } = useI18n();
</script>
<template>
  <div class="list">
    <TagSelector
      @tags-changed="setFilters"
      label="AllFilesView.filter_label"
    ></TagSelector>
    <div v-if="filteredFiles.length > 0" class="list">
      <FileContainer
        v-for="entry in filteredFiles"
        :key="JSON.stringify(entry)"
        :entry="entry"
        @tag-deleted="onTagDeleted"
      ></FileContainer>
    </div>
    <div v-else>
      No files matching the tags "<span>{{ filters.join(", ") }}</span
      >" exist.
    </div>
  </div>
</template>

<style>
.list {
  display: flex;
  flex-direction: column;
}
.list > * {
  margin-bottom: 0.25rem;
}
</style>
