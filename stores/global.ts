import { v4 as uuidv4 } from "uuid";

export interface Instance {
  id: string;
  x: number;
  y: number;
  z: number;
  name: string;
  emoji: string;
  discovered: boolean;
  ref: (Element | null)[];
  selected: boolean;
  loading: boolean;
}

export interface Board {
  offset: {
    x: number;
    y: number;
  };
  instances: Instance[];
  dragging: string | null;
  initX: number;
  initY: number;
}

export const useGlobalStore = defineStore("global", () => {
  const searchQuery = ref("");
  const sortBy = ref("time");
  const reversedSearch = ref(false);
  const showDiscoveriesOnly = ref(false);
  const board: Ref<Board> = ref({
    offset: {
      x: 0,
      y: 0,
    },
    instances: [],
    dragging: null,
    initX: 0,
    initY: 0,
  });
  const sidebarRef: Ref<Element | null> = ref(null);
  const selectionRef: Ref<Element | null> = ref(null);

  function createInstance({
    x,
    y,
    name,
    emoji,
    discovered,
    selected,
    makeDragging,
  }: {
    x: number;
    y: number;
    name: string;
    emoji: string;
    discovered: boolean;
    selected?: boolean;
    makeDragging?: boolean;
  }) {
    const id = uuidv4();
    board.value.instances.push({
      id,
      x,
      y,
      z: 3,
      name,
      emoji,
      discovered,
      ref: [null],
      selected: selected ?? false,
      loading: false,
    });
    if (makeDragging ?? true) {
      board.value.dragging = id;
    }
    return id;
  }
  function removeInstance(id: string) {
    board.value.instances = board.value.instances.filter(
      (inst) => inst.id !== id,
    );
  }

  return {
    searchQuery,
    sortBy,
    reversedSearch,
    showDiscoveriesOnly,
    sidebarRef,
    selectionRef,
    board,
    createInstance,
    removeInstance,
  };
});
