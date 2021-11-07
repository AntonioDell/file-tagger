<template >
    <div class="pill">
        <button @click="onDelete">X</button>
        {{ tag }}
    </div>
</template>
<script setup lang="ts">

interface TagPillProps {
    tag: string
}

const emits = defineEmits(["delete"])

const { tag } = defineProps<TagPillProps>()

const onDelete = () => {
    emits("delete", tag);
}

</script>
<style lang="css">
.pill {
    border-radius: 50%;
}
</style>