<script setup lang="ts">
import { liveQuery } from "dexie";

const aeData = useDexie().aeData;

const combinations = useObservable(
  from(liveQuery(() => aeData.combinations.toArray())),
);

const open = ref(true);

onBeforeRouteLeave(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
});

const { data: element, error } = await useFetch(
  `/api/elements/${useRoute().params.id}`,
);

async function close() {
  open.value = false;
  await navigateTo("/");
}

if (error.value) {
  await close();
}
onMounted(async () => {
  const aeData = useDexie().aeData;

  if (!(await aeData.elements.get(4))) {
    navigateTo("/welcome");
  }
});
</script>

<template>
  <UModal
    v-model:open="open"
    :close="{ onClick: async () => await close() }"
    title="Element"
    :dismissible="false"
  >
    <template #body>
      <div class="relative flex flex-col gap-2">
        <h1 class="text-3xl font-bold">
          {{ element?.emoji }}
          {{ element?.name }}
        </h1>
        <p class="flex-1">
          {{ element?.description }}
        </p>
        <div
          class="flex flex-col items-center justify-center gap-2 text-center"
        >
          <div
            class="flex items-center gap-2"
            v-for="combination in combinations?.filter(
              (combination) => combination.result === element?.name,
            ) || []"
          >
            <AEModalElement :name="combination.elements[0]" />
            +
            <AEModalElement
              v-for="element in combination.elements.toSpliced(0, 1)"
              :name="element"
            />
          </div>
        </div>
        <br />
        <p class="absolute right-0 bottom-0 text-xs text-(--ui-text-dimmed)">
          #{{ element?.id }}
        </p>
      </div>
    </template>
  </UModal>
</template>
