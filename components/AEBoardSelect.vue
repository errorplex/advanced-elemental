<script setup lang="ts">
const { x, y, width, height } = defineProps<{
  x: number;
  y: number;
  width: number;
  height: number;
}>();

const globalStore = useGlobalStore();
const { selectionRef } = storeToRefs(globalStore);

const _window: Ref<Window | null> = ref(null);

onMounted(() => {
  _window.value = window;
});
</script>

<template>
  <div
    class="absolute z-[4] rounded bg-(--ui-primary) opacity-30"
    :style="{
      top: height < 0 ? 'unset' : y + 'px',
      left: width < 0 ? 'unset' : x + 'px',
      bottom: height < 0 ? (_window?.innerHeight || 0) - y + 'px' : 'unset',
      right: width < 0 ? (_window?.innerWidth || 0) - x + 'px' : 'unset',
      width: Math.abs(width) + 'px',
      height: Math.abs(height) + 'px',
    }"
    :ref="(el) => el && (selectionRef = el as Element)"
  ></div>
</template>
