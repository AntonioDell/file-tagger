<script setup lang="ts">
import { FileEntry } from '@/repository/files';
import FileContainer from './FileContainer.vue';

interface FileListProps {
    fileEntries?: FileEntry[]
}

withDefaults(defineProps<FileListProps>(), { fileEntries: () => [] });
</script>
<template>
    <FileContainer v-for="entry in fileEntries" :key="entry.fullPath" :entry="entry"></FileContainer>
</template>

<style >
</style>