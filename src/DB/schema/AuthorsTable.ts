import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { date, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const AuthorsTable = pgTable('authors', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    surname: varchar('surname', { length: 256 }).notNull(),
    birthDate: date("birth_date", { mode: "date" }).notNull()
});

export type Author = InferSelectModel<typeof AuthorsTable>;
export type NewAuthor = InferInsertModel<typeof AuthorsTable>;