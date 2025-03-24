import { drizzle } from "drizzle-orm/node-postgres";
import { sql, eq } from "drizzle-orm";
import { elementTable, combinationTable } from "./schema";

export const db = drizzle(process.env.DATABASE_URL!);

export async function initDb() {
  const elements = await db.select().from(elementTable);

  if (elements.length >= 4) return;

  if (elements.length < 4) {
    await db.execute(
      sql`TRUNCATE TABLE elements, combinations RESTART IDENTITY;`,
    );
  }

  await db
    .insert(elementTable)
    .values([
      {
        name: "Water",
        emoji: "💧",
        description:
          "A liquid that adapts and sustains life through its dynamic nature.",
      },
      {
        name: "Fire",
        emoji: "🔥",
        description: "The element that burns things.",
      },
      {
        name: "Earth",
        emoji: "🌱",
        description: "Soil essential for all living things to grow.",
      },
      {
        name: "Air",
        emoji: "💨",
        description: "An invisible substance that helps us breathe.",
      },
    ])
    .onConflictDoNothing();
}

export async function findElement(name: string) {
  return (
    (
      await db.select().from(elementTable).where(eq(elementTable.name, name))
    ).at(-1) || null
  );
}

export async function findCombination(combination: string[]) {
  return (
    (
      await db
        .select()
        .from(combinationTable)
        .where(eq(combinationTable.elements, combination))
    ).at(-1) || null
  );
}

export async function createElement({
  name,
  emoji,
  description,
}: {
  name: string;
  emoji: string;
  description: string;
}) {
  return await db
    .insert(elementTable)
    .values({ name, emoji, description })
    .onConflictDoNothing();
}

export async function createCombination({
  elements,
  result,
}: {
  elements: string[];
  result: string;
}) {
  return await db
    .insert(combinationTable)
    .values({ elements, result })
    .onConflictDoNothing();
}
