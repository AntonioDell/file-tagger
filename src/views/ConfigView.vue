<script setup lang="ts">
import { removeAllTags, selectRootDir } from "@/repository/files";
import { ref } from "@vue/reactivity";
import { useI18n } from "vue-i18n";

interface ConfigViewProps {
  rootDir: String;
}

const rootFolder = ref<String>();
const { t } = useI18n();
const { rootDir } = defineProps<ConfigViewProps>();
const emit = defineEmits(["rootDirSelected"]);
rootFolder.value = rootDir;

const showSelectionDialog = async () => {
  const response = await selectRootDir();
  if (!response.ok || !response.data) {
    return;
  }
  rootFolder.value = response.data;
  emit("rootDirSelected");
};
const callRemoveAllTags = async () => {
  await removeAllTags();
};
</script>
<template>
  <div class="container">
    <label for="rootFolder">{{ t("ConfigView.selection_label") }}</label>
    <input
      type="text"
      readonly
      id="rootFolder"
      webkitdirectory
      @click="showSelectionDialog"
      :value="rootFolder"
    />
  </div>
  <div class="container">
    <button @click="callRemoveAllTags">Remove all tags</button>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
input {
  width: 70%;
}
</style>
