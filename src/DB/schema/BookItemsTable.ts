import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { bigint, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { BooksTable } from './BooksTable';
import { LanguagesTable } from './LanguagesTable';
import { LocationsTable } from './LocationsTable';

export const BookItemsTable = pgTable("book_items", {
    ean: serial('ean').primaryKey(),
    isbn: bigint("ISBN", { mode: "bigint" }).notNull(),
    remarks: varchar("remarks", { length: 256 }).notNull(),
    bookId: integer("book_id").references(() => BooksTable.id).notNull(),
    locationId: integer("location_id").references(() => LocationsTable.id).notNull(),
    languageId: integer("language_id").references(() => LanguagesTable.id).notNull(),
})

export type BookItem = InferSelectModel<typeof BookItemsTable>;
export type NewBookItem = InferInsertModel<typeof BookItemsTable>;