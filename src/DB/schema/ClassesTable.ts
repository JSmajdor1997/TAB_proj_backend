import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const ClassesTable = pgTable('classes', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    startingDate: date("starting_year", { mode: "date" }).notNull()
});

export type Class = InferSelectModel<typeof ClassesTable>;
export type NewClass = InferInsertModel<typeof ClassesTable>;