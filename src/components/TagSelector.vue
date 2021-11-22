<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import { useI18n } from "vue-i18n";

interface TagSelector {
  label: string;
  emptyAfterSelection?: boolean;
}
const { label, emptyAfterSelection } = withDefaults(
  defineProps<TagSelector>(),
  { emptyAfterSelection: false }
);
const emit = defineEmits(["tagsChanged"]);
const { t } = useI18n();
const tagSelector = ref("");
const selectors = computed(() => {
  if (!tagSelector.value) {
    return [];
  }
  return splitTags(tagSelector.value);
});

const splitTags = (joinedTags: string | String): string[] => {
  return joinedTags
    .split(",")
    .map((filter) => filter.trim())
    .filter((filter) => filter !== "");
};

const onEnterPressed = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    onSelectionChange();
  }
};

const onSelectionChange = () => {
  emit("tagsChanged", selectors.value);
  console.log(emptyAfterSelection);
  if (emptyAfterSelection) {
    tagSelector.value = "";
    console.log(tagSelector.value);
  }
};
</script>
<template>
  <div class="selector-container">
    <label for="tag-selector">{{ t(label) }}</label>
    <input
      type="text"
      name="tag-selector"
      id="tag-selector"
      v-model="tagSelector"
      @keypress="onEnterPressed"
    />
    <button @click="onSelectionChange">Select</button>
  </div>
</template>
<style scoped>
.selector-container {
  height: 2.5rem;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.selector-container > input {
  height: fit-content;
}
</style>
