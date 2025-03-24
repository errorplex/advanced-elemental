<script setup lang="ts">
function preventRightClickMenu(e: MouseEvent) {
  e.preventDefault();
}

onMounted(() => {
  window.addEventListener("contextmenu", preventRightClickMenu);
});
onBeforeUnmount(() => {
  window.removeEventListener("contextmenu", preventRightClickMenu);
});
</script>

<template>
  <UApp class="">
    <slot />
    <div class="flex h-svh divide-x-2 divide-(--ui-border)">
      <AEBoard />
      <AESidebar />
    </div>
  </UApp>
</template>
