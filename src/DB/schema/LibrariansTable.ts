import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const LibrariansTable = pgTable('librarians', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    surname: varchar('surname', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    password: varchar('password', { length: 256 }).notNull()
});

export type Librarian = InferSelectModel<typeof LibrariansTable>;
export type NewLibrarian = InferInsertModel<typeof LibrariansTable>;