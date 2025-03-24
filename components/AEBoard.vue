<script setup lang="ts">
const globalStore = useGlobalStore();
const { board, sidebarRef, selectionRef } = storeToRefs(globalStore);
const { createInstance, removeInstance } = globalStore;

const aeData = useDexie().aeData;

const initX = ref(0);
const initY = ref(0);

const panningBoard = ref(false);

const selecting = ref(false);
const selectX = ref(0);
const selectY = ref(0);
const selectWidth = ref(0);
const selectHeight = ref(0);

const toast = useToast();

function onMouseMove(e: MouseEvent) {
  if (selecting.value) {
    selectWidth.value = e.clientX - selectX.value;
    selectHeight.value = e.clientY - selectY.value;
    const selectionRect = selectionRef.value?.getBoundingClientRect();
    board.value.instances.map((inst) => {
      if (inst.selected) return;

      const instRect = inst.ref[0]?.getBoundingClientRect();

      if (
        selectionRect &&
        instRect &&
        !(
          selectionRect.bottom < instRect.top ||
          selectionRect.top > instRect.bottom ||
          selectionRect.right < instRect.left ||
          selectionRect.left > instRect.right
        )
      ) {
        inst.selected = true;
      }

      return inst;
    });
  }
  if (board.value.dragging === null) return;
  board.value.instances.map((inst) => {
    if (inst.id === board.value.dragging || inst.selected) {
      inst.x += e.clientX - board.value.initX;
      inst.y += e.clientY - board.value.initY;
    }
    return inst;
  });
  board.value.initX = e.clientX;
  board.value.initY = e.clientY;
}
function onMouseUp(e: MouseEvent) {
  e.stopPropagation();
  const sidebarRect = sidebarRef.value?.getBoundingClientRect();
  board.value.instances.forEach((inst) => {
    if (!inst.selected && board.value.dragging !== inst.id) return;
    const rect = inst.ref[0]?.getBoundingClientRect();
    if (
      sidebarRect &&
      rect &&
      !(
        rect.bottom < sidebarRect.top ||
        rect.top > sidebarRect.bottom ||
        rect.right < sidebarRect.left
      )
    ) {
      removeInstance(inst.id);
    }
  });
  if (board.value.instances.findIndex((inst) => inst.selected) === -1) {
    const draggingInst = board.value.instances.find(
      (inst) => inst.id === board.value.dragging,
    );
    const draggingInstRect = draggingInst?.ref[0]?.getBoundingClientRect();
    if (draggingInst && draggingInstRect) {
      for (let inst of board.value.instances) {
        if (inst.id === board.value.dragging) continue;
        const rect = inst.ref[0]?.getBoundingClientRect();
        if (
          rect &&
          !(
            rect.bottom < draggingInstRect.top ||
            rect.top > draggingInstRect.bottom ||
            rect.right < draggingInstRect.left ||
            rect.left > draggingInstRect.right
          )
        ) {
          combineTwoElements([inst, draggingInst]);
          break;
        }
      }
    }
  }
  board.value.dragging = null;
  panningBoard.value = false;
  selecting.value = false;
}

function boardMouseDown(e: MouseEvent) {
  e.preventDefault();

  if (e.button === 2) {
    board.value.instances.map((inst) => {
      inst.z = 1;
      inst.selected = false;
      return inst;
    });
    return selectStart(e);
  }
  if (e.button !== 0) return;
  if (!e.ctrlKey && !e.metaKey) return;
  board.value.instances.map((inst) => (inst.z = 1));
  panningBoard.value = true;
  initX.value = e.clientX;
  initY.value = e.clientY;
}
function boardMouseMove(e: MouseEvent) {
  if (!panningBoard.value) return;
  board.value.offset.x += e.clientX - initX.value;
  board.value.offset.y += e.clientY - initY.value;
  initX.value = e.clientX;
  initY.value = e.clientY;
}

function elementMouseDown(e: MouseEvent, inst: Instance) {
  if (e.ctrlKey) return;
  if (inst.loading) return;
  if (e.button === 2) {
    e.stopPropagation();
    removeInstance(inst.id);
    if (inst.selected) {
      board.value.instances.forEach((inst) => {
        if (inst.selected) {
          removeInstance(inst.id);
        }
      });
    }
    return;
  }
  if (e.button === 1 || (e.shiftKey && e.button === 0)) {
    if (inst.selected) {
      board.value.instances.forEach((inst) => {
        if (inst.selected) {
          inst.selected = false;
          createInstance({
            ...inst,
            x: inst.x,
            y: inst.y,
            selected: true,
          });
        }
      });
    } else {
      board.value.dragging = createInstance(inst);
    }
    board.value.initX = e.clientX;
    board.value.initY = e.clientY;
    return;
  }
  if (!inst.selected) {
    board.value.instances.map((inst) => (inst.selected = false));
  }
  board.value.dragging = inst.id;
  board.value.initX = e.clientX;
  board.value.initY = e.clientY;
  board.value.instances.map((inst) => {
    if (board.value.dragging === inst.id || inst.selected) {
      inst.z = 3;
    } else {
      inst.z = 1;
    }
  });
}

function selectStart(e: MouseEvent) {
  selecting.value = true;
  selectX.value = e.clientX;
  selectY.value = e.clientY;
  selectWidth.value = 0;
  selectHeight.value = 0;
}

async function combineTwoElements([first, second]: Instance[]) {
  first.loading = true;
  second.loading = true;
  const avgPos = {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
  const { name, emoji, description, discovered } = await $fetch<{
    name: string;
    emoji: string;
    description: string;
    discovered: boolean;
  }>("/api/combine", {
    method: "POST",
    body: { combination: [first.name, second.name].sort() },
  });
  first.loading = false;
  second.loading = false;
  if (name === "SPECIAL:ERR") {
    toast.add({
      title: "Error",
      description: "Failed to combine elements",
      color: "error",
    });
    return;
  }
  if (!(await aeData.elements.get({ name }))) {
    await aeData.elements.add({ name, emoji, description, discovered });
  }
  if (
    !(await aeData.combinations.get({
      elements: [first.name, second.name].sort(),
    }))
  ) {
    await aeData.combinations.add({
      elements: [first.name, second.name].sort(),
      result: name,
    });
  }
  removeInstance(first.id);
  removeInstance(second.id);
  createInstance({
    ...avgPos,
    name,
    emoji,
    discovered,
    makeDragging: false,
  });
}

onMounted(() => {
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousemove", boardMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mousemove", boardMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
});
</script>

<template>
  <AEBoardSelect
    v-if="selecting"
    :x="selectX"
    :y="selectY"
    :width="selectWidth"
    :height="selectHeight"
  />
  <div class="relative flex-1" @mousedown="boardMouseDown">
    <AEBoardElement
      v-for="inst in board.instances"
      :key="inst.id"
      v-bind="{
        id: inst.id,
        x: inst.x,
        y: inst.y,
        z: inst.z,
        name: inst.name,
        emoji: inst.emoji,
        discovered: inst.discovered,
        instRef: inst.ref,
        selected: inst.selected,
        loading: inst.loading,
      }"
      @mousedown="(e) => elementMouseDown(e, inst)"
    />
  </div>
</template>
