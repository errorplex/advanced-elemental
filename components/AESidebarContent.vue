<script setup lang="ts">
import { liveQuery } from "dexie";

const globalStore = useGlobalStore();
const { searchQuery, sortBy, reversedSearch, showDiscoveriesOnly } =
  storeToRefs(globalStore);

const aeData = useDexie().aeData;

const elements = useObservable(
  from(liveQuery(() => aeData.elements.toArray())),
);

const orderedElements = computed(() => {
  let tempElements: Elem[] = [];

  tempElements = elements.value || [];

  if (sortBy.value === "alphabetical") {
    tempElements = tempElements.toSorted((a, b) => (a.name > b.name ? 1 : -1));
  }
  if (sortBy.value === "length") {
    tempElements = tempElements.toSorted((a, b) =>
      a.name.length > b.name.length ? -1 : 1,
    );
  }
  if (reversedSearch.value) {
    tempElements = tempElements.toReversed();
  }

  return tempElements;
});

const filteredElements = computed(() => {
  if (!searchQuery) return orderedElements.value;

  let tempElements = orderedElements.value;

  if (showDiscoveriesOnly.value) {
    tempElements = tempElements.filter((el) => el.discovered);
  }

  return (
    tempElements.filter((el) => {
      return (
        el.name.toLowerCase().indexOf(searchQuery.value.toLowerCase()) > -1
      );
    }) || []
  );
});

const sortedElements = computed(() => {
  const firstPart = filteredElements.value.filter(
    (el) =>
      el.name.toLowerCase().indexOf(searchQuery.value.toLowerCase()) === 0,
  );
  const secondPart = filteredElements.value.filter(
    (el) => el.name.toLowerCase().indexOf(searchQuery.value.toLowerCase()) > 0,
  );

  return [...firstPart, ...secondPart];
});
</script>

<template>
  <div
    class="flex flex-wrap content-start gap-2 overflow-auto p-2 [scrollbar-color:var(--ui-border)_transparent]"
  >
    <AESidebarElement v-for="element in sortedElements" v-bind="element" />
  </div>
</template>
