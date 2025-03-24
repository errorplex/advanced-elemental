import { pgTable, serial, unique, varchar } from "drizzle-orm/pg-core";

export const elementTable = pgTable("elements", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  emoji: varchar("emoji").notNull(),
  description: varchar("description").notNull(),
});

export const combinationTable = pgTable("combinations", {
  id: serial("id").primaryKey(),
  elements: varchar("elements").array().unique().notNull(),
  result: varchar("result").notNull(),
});
