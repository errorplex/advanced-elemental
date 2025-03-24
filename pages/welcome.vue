<script setup lang="ts">
const open = ref(true);

onBeforeRouteLeave(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
});

onMounted(async () => {
  const aeData = useDexie().aeData;

  if (!(await aeData.elements.get(4))) {
    await aeData.elements.bulkAdd([
      {
        name: "Water",
        emoji: "💧",
        description:
          "A liquid that adapts and sustains life through its dynamic nature.",
        discovered: false,
      },
      {
        name: "Fire",
        emoji: "🔥",
        description:
          "A force that transforms and purifies, bringing warmth and light.",
        discovered: false,
      },
      {
        name: "Earth",
        emoji: "🌱",
        description: "Soil essential for all living things to grow.",
        discovered: false,
      },
      {
        name: "Air",
        emoji: "💨",
        description: "An invisible substance that helps us breathe.",
        discovered: false,
      },
    ]);
  }
});
</script>

<template>
  <UModal :open="open" title="Welcome!" :close="false" :dismissable="false">
    <template #body>
      <p>
        Advanced Elemental is an open-source alchemy game powered by AI, where
        you can combine up to 4 elements to create a new element.<br /><br />
        You have 4 elements to begin your journey:<br />
        💧 Water, 🔥 Fire, 🌱 Earth, and 💨 Air.<br /><br />
        To combine them, you can either drag an element on top of another one to
        combine two elements, or hold right click to select the elements you
        want to combine to combine 3 or 4.<br /><br />
        We have a
        <ULink to="https://discord.gg/Gbt7QWZBcQ">Discord server</ULink>
        where we discuss this game and other game ideas!
      </p>
    </template>
    <template #footer>
      <UButton
        class="cursor-pointer"
        @click="
          async () => {
            open = false;
            await navigateTo('/');
          }
        "
      >
        Play!
      </UButton>
    </template>
  </UModal>
</template>
