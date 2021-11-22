<script setup lang="ts">
import AllFilesView from "@/views/AllFilesView.vue";
import NavBar from "@/components/NavBar.vue";
import { NavigationTarget } from "./repository/navigation";
import { ref } from "@vue/reactivity";
import UntaggedFilesView from "./views/UntaggedFilesView.vue";

const navigationTarget = ref<NavigationTarget>(NavigationTarget.ALL_FILES);

const onNavigationChanged = (newTarget: NavigationTarget) => {
  navigationTarget.value = newTarget
}

</script>

<template>
  <NavBar @navigation-changed="onNavigationChanged"></NavBar>
  <main>
    <AllFilesView v-if="navigationTarget === NavigationTarget.ALL_FILES" />
    <UntaggedFilesView v-else-if="navigationTarget === NavigationTarget.UNTAGGED_FILES" />
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
main {
  margin: 0.5rem;
}
</style>
