<template>
  <nav>
    <button
      v-for="target of getButtonTargets()"
      :key="target.target"
      @click="onTargetClick(target.target)"
    >
      {{ target.label }}
    </button>
  </nav>
</template>
<script setup lang="ts">
import { navigationLabels, NavigationTarget } from "@/repository/navigation";
import { ref } from "@vue/reactivity";

interface NavBarProps {
  disableTargets: NavigationTarget[];
}
const { disableTargets } = defineProps<NavBarProps>();

interface ButtonTarget {
  target: NavigationTarget;
  label: String;
}

const currentTarget = ref<NavigationTarget>(0);

const emit = defineEmits(["navigationChanged"]);

const getButtonTargets = (): ButtonTarget[] => {
  return navigationLabels
    .filter((_, index) => !disableTargets.includes(index))
    .map((value, index) => ({
      target: index as NavigationTarget,
      label: value,
    }));
};
const onTargetClick = (target: NavigationTarget) => {
  if (!NavigationTarget[target]) {
    console.error(
      `Target "${navigationLabels[target]}" with index ${target} does not exist in NavigationTargets.`,
      NavigationTarget
    );
    return;
  }
  currentTarget.value = target;
  emit("navigationChanged", currentTarget.value);
};
</script>
<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  width: 100vw;
  height: 3rem;
  background-color: black;
  color: white;
  align-items: center;
}
button {
  all: unset;
  border: 2px solid white;
  padding: 0.25rem;
}
button:active {
  background-color: white;
  color: black;
}
button:focus {
  border-color: blue;
}
</style>
