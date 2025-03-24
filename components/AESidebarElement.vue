<script setup lang="ts">
const globalStore = useGlobalStore();
const { board } = storeToRefs(globalStore);
const { createInstance } = globalStore;

const { name, emoji, discovered } = defineProps<{
  name: string;
  emoji: string;
  discovered: boolean;
}>();

const toast = useToast();

const elementRef: Ref<Element | null> = ref(null);

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

function onMouseDown(e: MouseEvent) {
  if (e.button === 2) return openDialog();
  if (!elementRef.value) return;
  board.value.instances.map((inst) => (inst.selected = false));
  const rect = elementRef.value.getBoundingClientRect();
  board.value.initX = e.clientX;
  board.value.initY = e.clientY;
  createInstance({
    x: rect.left - board.value.offset.x,
    y: rect.top - board.value.offset.y,
    name,
    emoji,
    discovered,
  });
}
</script>

<template>
  <div
    class="cursor-pointer rounded bg-(--ui-bg) p-2 ring ring-(--ui-border-accented) select-none"
    :ref="(el) => el && (elementRef = el as Element)"
    @mousedown="onMouseDown"
  >
    {{ emoji }} {{ name }}
  </div>
</template>
