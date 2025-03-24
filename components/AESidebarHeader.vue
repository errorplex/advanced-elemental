<script setup lang="ts">
const globalStore = useGlobalStore();
const { searchQuery, sortBy, reversedSearch, showDiscoveriesOnly } =
  storeToRefs(globalStore);

const sortItems = ref([
  {
    label: "Time",
    value: "time",
  },
  {
    label: "Alphabetical",
    value: "alphabetical",
  },
  {
    label: "Length",
    value: "length",
  },
]);
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div class="flex space-x-2">
      <UInput
        class="flex-1"
        size="xl"
        icon="i-lucide-search"
        placeholder="Search items..."
        v-model="searchQuery"
      />
      <UButton
        icon="i-lucide-settings"
        size="xl"
        class="cursor-pointer bg-(--ui-bg) text-(--ui-text) ring ring-(--ui-border-accented) hover:bg-(--ui-bg-elevated)"
      />
    </div>
    <div class="flex space-x-2">
      <USelect
        class="flex-1"
        size="xl"
        :default-value="'time'"
        v-model="sortBy"
        :items="sortItems"
      />
    </div>
    <div class="flex flex-wrap justify-evenly gap-2">
      <div class="flex max-w-2/5 items-center gap-2 text-center text-xs">
        <USwitch v-model="reversedSearch" />
        Reversed
      </div>
      <div class="flex max-w-2/5 items-center gap-2 text-center text-xs">
        <USwitch v-model="showDiscoveriesOnly" />
        Discoveries Only
      </div>
    </div>
  </div>
</template>
