import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const BooksTable = pgTable('books', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
});

export type Book = InferSelectModel<typeof BooksTable>;
export type NewBook = InferInsertModel<typeof BooksTable>;