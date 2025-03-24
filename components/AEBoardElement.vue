<script setup lang="ts">
const globalStore = useGlobalStore();
const { board } = storeToRefs(globalStore);

const { id, x, y, z, name, emoji, discovered, instRef, selected, loading } =
  defineProps<{
    id: string;
    x: number;
    y: number;
    z: number;
    name: string;
    emoji: string;
    discovered: boolean;
    instRef: (Element | null)[];
    selected: boolean;
    loading: boolean;
  }>();

const emit = defineEmits<{
  mousedown: [e: MouseEvent];
}>();
</script>

<template>
  <div
    class="absolute cursor-pointer overflow-hidden rounded bg-(--ui-bg) p-2 ring ring-(--ui-border-accented) select-none"
    :class="[selected && 'bg-primary-800!', loading && 'animate-pulse']"
    :style="{
      zIndex: z,
      left: board.offset.x + 'px',
      top: board.offset.y + 'px',
      transform: `translate(${x}px, ${y}px)`,
    }"
    @mousedown="(e) => emit('mousedown', e)"
    :ref="(el) => el && (instRef[0] = el as Element)"
  >
    {{ emoji }} {{ name }}
  </div>
</template>
