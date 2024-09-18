import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { bigint, index, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { BooksTable } from './BooksTable';
import { LanguagesTable } from './LanguagesTable';
import { LocationsTable } from './LocationsTable';

export const BookItemsTable = pgTable("book_items", {
    ean: serial('ean').primaryKey(),
    isbn: bigint("ISBN", { mode: "bigint" }).notNull(),
    remarks: varchar("remarks", { length: 256 }).notNull(),
    bookId: integer("book_id").references(() => BooksTable.id, {onUpdate: "cascade", onDelete: "cascade"}).notNull(),
    locationId: integer("location_id").references(() => LocationsTable.id, {onUpdate: "cascade"}).notNull(),
    languageId: integer("language_id").references(() => LanguagesTable.id, {onUpdate: "cascade"}).notNull(),
}, (table) => {
    return {
        // Index on language_id
        languageIdIndex: index('language_idx').on(table.languageId),

        // Index on location_id
        locationIdIndex: index('location_idx').on(table.locationId),

        // Index on book_id (BTREE is default in most databases like PostgreSQL)
        bookIdIndex: index('book_item_id_idx').on(table.bookId),
    };
})

export type BookItem = InferSelectModel<typeof BookItemsTable>;
export type NewBookItem = InferInsertModel<typeof BookItemsTable>;