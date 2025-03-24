import Dexie, { type EntityTable } from "dexie";

interface Elem {
  id: number;
  name: string;
  emoji: string;
  description: string;
  discovered: boolean;
}

interface Combination {
  id: number;
  elements: string[];
  result: string;
}

class AEData extends Dexie {
  elements!: EntityTable<Elem, "id">;
  combinations!: EntityTable<Combination, "id">;
  constructor() {
    super("AEData");
    this.version(1).stores({
      elements: "++id, &name, emoji, description, discovered",
      combinations: "++id, &elements, result",
    });
  }
}

export const useDexie = () => {
  const aeData = new AEData();

  return { aeData };
};

export type { Elem, Combination };
