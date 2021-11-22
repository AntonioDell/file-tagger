<script setup lang="ts">
import AllFilesView from "@/views/AllFilesView.vue";
import NavBar from "@/components/NavBar.vue";
import { NavigationTarget } from "./repository/navigation";
import { ref } from "@vue/reactivity";
import UntaggedFilesView from "./views/UntaggedFilesView.vue";
import ConfigView from "./views/ConfigView.vue";
import { getRootDirectory } from "./repository/files";

const navigationTarget = ref<NavigationTarget>(NavigationTarget.CONFIG);
const rootDir = ref<String>("");
const disableTargets = ref<NavigationTarget[]>([
  NavigationTarget.ALL_FILES,
  NavigationTarget.UNTAGGED_FILES,
]);

const onNavigationChanged = (newTarget: NavigationTarget) => {
  navigationTarget.value = newTarget;
};

const refreshRootDirectory = async () => {
  const response = await getRootDirectory();
  if (response.ok && response.data) {
    disableTargets.value = [];
    rootDir.value = response.data;
    navigationTarget.value = NavigationTarget.ALL_FILES;
  }
};
refreshRootDirectory();
</script>

<template>
  <NavBar
    :key="disableTargets.join()"
    @navigation-changed="onNavigationChanged"
    :disable-targets="disableTargets"
  ></NavBar>
  <main>
    <ConfigView
      v-if="navigationTarget === NavigationTarget.CONFIG"
      :root-dir="rootDir"
      @root-dir-selected="refreshRootDirectory"
    ></ConfigView>
    <AllFilesView v-else-if="navigationTarget === NavigationTarget.ALL_FILES" />
    <UntaggedFilesView
      v-else-if="navigationTarget === NavigationTarget.UNTAGGED_FILES"
    />
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
