import { eq } from "drizzle-orm";
import { db, initDb } from "~/server/db/drizzle";
import { elementTable, combinationTable } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID should be a number",
    });
  }

  await initDb();

  const element =
    (await db.select().from(elementTable).where(eq(elementTable.id, id)))[0] ||
    createError({
      statusCode: 404,
      statusMessage: "Element not found",
    });

  return element;
});
