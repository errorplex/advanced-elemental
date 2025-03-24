import { findElement, initDb } from "~/server/db/drizzle";

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event);

  if (!name) return -1;

  await initDb();

  return (await findElement(name))?.id || -1;
});
