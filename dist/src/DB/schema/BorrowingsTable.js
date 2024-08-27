"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowingsTable = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const BookItemsTable_1 = require("./BookItemsTable");
const LibrariansTable_1 = require("./LibrariansTable");
const StudentsTable_1 = require("./StudentsTable");
exports.BorrowingsTable = (0, pg_core_1.pgTable)("borrowings", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    studentId: (0, pg_core_1.integer)("student_id").references(() => StudentsTable_1.StudentsTable.id).notNull(),
    bookItemEan: (0, pg_core_1.integer)("book_item_ean").references(() => BookItemsTable_1.BookItemsTable.ean).notNull(),
    librarianId: (0, pg_core_1.integer)("librarian_id").references(() => LibrariansTable_1.LibrariansTable.id).notNull(),
    borrowingDate: (0, pg_core_1.date)("borrowing_date", { mode: "date" }).notNull(),
    returnDate: (0, pg_core_1.date)("return_date", { mode: "date" }).default((0, drizzle_orm_1.sql) `NULL`),
    paidFee: (0, pg_core_1.integer)("paid_fee").default((0, drizzle_orm_1.sql) `NULL`)
});
