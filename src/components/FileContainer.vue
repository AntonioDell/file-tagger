
<template>
    <div :class="{ 'file-container': true, 'checked': checked }" @click="onContainerClick">
        <div class="cb" v-if="isSelectable">
            <input type="checkbox" v-model="checked" />
        </div>
        <div class="file-infos">
            <h3>{{ entry.fileName }}</h3>
            <p>{{ entry.fullPath }}</p>
            <div class="tag-container">
                <p>Tags:</p>
                <TagPill
                    v-for="tag in (entry.meta?.tags || [])"
                    :key="tag"
                    :tag="tag"
                    @delete="onTagDelete"
                ></TagPill>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FileEntry } from '@/repository/files';
import { ref } from '@vue/reactivity';
import TagPill from '@/components/TagPill.vue';

interface FileContainerProps {
    entry: FileEntry,
    isSelectable?: boolean,
    isSelected?: boolean
}

const { isSelectable, isSelected } = withDefaults(defineProps<FileContainerProps>(), { isSelectable: false, isSelected: false })

const checked = ref(isSelected);
const onContainerClick = () => {
    if (!isSelectable) {
        return;
    }
    checked.value = !checked.value;
}
const onTagDelete = (tag: string) => {
    console.log(tag)
}
</script>


<style lang="css">
.file-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 2px solid black;
}
.file-container > * {
    margin: 0 3rem;
}
.file-container.checked {
    background-color: cadetblue;
}
.file-infos {
    width: 100%;
}
.cb {
    max-width: 2.5rem;
}
.tag-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
</style>