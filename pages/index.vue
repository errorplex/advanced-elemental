<script setup lang="ts">
onMounted(async () => {
  const aeData = useDexie().aeData;

  if (!(await aeData.elements.get(4))) {
    navigateTo("/welcome");
  }
});
</script>

<template>
  <div></div>
</template>
