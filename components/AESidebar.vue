<script setup lang="ts">
const globalStore = useGlobalStore();
const { board, sidebarRef } = storeToRefs(globalStore);

const width = ref(300);
const isResizing = ref(false);

function onResize(e: MouseEvent) {
  if (!isResizing.value) return;
  width.value = Math.min(
    Math.min(Math.max(window.innerWidth - e.clientX, 300), 800),
    window.innerWidth - 100,
  );
  board.value.instances.map((inst) => (inst.z = 1));
}

function onWindowResize() {
  width.value = Math.min(
    Math.min(Math.max(width.value, 300), 800),
    window.innerWidth - 100,
  );
  board.value.instances.map((inst) => (inst.z = 1));
}

function handleMouseUp() {
  isResizing.value = false;
}

onMounted(() => {
  window.addEventListener("mousemove", onResize);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mouseup", handleMouseUp);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onResize);
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("mouseup", handleMouseUp);
});
</script>

<template>
  <div
    class="relative z-[2] flex flex-col bg-[var(--ui-bg)]"
    :style="{
      width: width + 'px',
    }"
    :ref="(el) => el && (sidebarRef = el as Element)"
  >
    <div
      class="absolute top-0 left-0 h-full w-2 -translate-x-1/2 cursor-ew-resize"
      @mousedown="
        (e) => {
          e.preventDefault();
          isResizing = true;
        }
      "
    ></div>
    <div class="flex max-h-full flex-col gap-2 p-2">
      <AESidebarHeader />
      <AESidebarContent />
    </div>
  </div>
</template>
