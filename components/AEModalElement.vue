<script setup lang="ts">
const { name } = defineProps<{
  name: string;
}>();

const toast = useToast();

async function openDialog() {
  const id = await $fetch("/api/get-element-id", {
    method: "POST",
    body: { name },
  });
  if (id === -1) {
    return toast.add({
      title: "Error",
      description: "Element not found",
      color: "error",
    });
  }

  await navigateTo(`/elements/${id}`);
}
</script>

<template>
  <div
    class="cursor-pointer rounded bg-(--ui-bg) p-2 ring ring-(--ui-border-accented) select-none"
    @contextmenu="openDialog"
  >
    {{ name }}
  </div>
</template>
