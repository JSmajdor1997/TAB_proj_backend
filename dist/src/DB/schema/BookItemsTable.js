"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookItemsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const BooksTable_1 = require("./BooksTable");
const LanguagesTable_1 = require("./LanguagesTable");
const LocationsTable_1 = require("./LocationsTable");
exports.BookItemsTable = (0, pg_core_1.pgTable)("book_items", {
    ean: (0, pg_core_1.serial)('ean').primaryKey(),
    isbn: (0, pg_core_1.bigint)("ISBN", { mode: "bigint" }).notNull(),
    remarks: (0, pg_core_1.varchar)("remarks", { length: 256 }).notNull(),
    bookId: (0, pg_core_1.integer)("book_id").references(() => BooksTable_1.BooksTable.id).notNull(),
    locationId: (0, pg_core_1.integer)("location_id").references(() => LocationsTable_1.LocationsTable.id).notNull(),
    languageId: (0, pg_core_1.integer)("language_id").references(() => LanguagesTable_1.LanguagesTable.id).notNull(),
});
