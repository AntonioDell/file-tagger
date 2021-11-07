<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import FileList from "@/components/FileList.vue";
import { computed, ref } from "@vue/reactivity";
import { ApiResponse, FileEntry, getTaggedFiles, getUntaggedFiles, setFileTags } from "@/repository/files";

const allFiles = ref<FileEntry[]>([]);
const tagFilter = ref('')

const filteredFiles = computed(() => {
  console.log(filters.value);

  if (filters.value.length == 0) {
    return allFiles.value;
  }
  return allFiles.value.filter(file => filters.value.every(filter => file.meta?.tags?.includes(filter.toLowerCase())))
})
const filters = computed(() => {
  if (!tagFilter.value) {
    return []
  }
  return tagFilter.value.split(",").map(filter => filter.trim()).filter(filter => filter !== "");
})


const addFileEntries = <T extends ApiResponse<FileEntry[]>>(response: T) => {
  if (response.data) {
    allFiles.value = allFiles.value.concat(response.data);
  }
}
getUntaggedFiles().then(addFileEntries);
getTaggedFiles().then(addFileEntries)
</script>

<template>
  <label for="tag-filter">Add comma seperated tags to filter the list:</label>
  <input type="text" name="tag-filter" id="tag-filter" v-model="tagFilter" />
  <p>{{ filters.join("|") }}</p>
  <FileList :file-entries="filteredFiles" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
