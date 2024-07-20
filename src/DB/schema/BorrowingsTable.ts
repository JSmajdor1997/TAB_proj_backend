import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import { date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { BookItemsTable } from './BookItemsTable';
import { LibrariansTable } from './LibrariansTable';
import { StudentsTable } from './StudentsTable';

export const BorrowingsTable = pgTable("borrowings", {
    id: serial('id').primaryKey(),
    studentId: integer("student_id").references(() => StudentsTable.id).notNull(),
    bookItemEan: integer("book_item_ean").references(() => BookItemsTable.ean).notNull(),
    librarianId: integer("librarian_id").references(() => LibrariansTable.id).notNull(),
    borrowingDate: date("borrowing_date", { mode: "date" }).notNull(),
    returnDate: date("return_date", { mode: "date" }).default(sql`NULL`),
    paidFee: integer("paid_fee").default(sql`NULL`)
})

export type Borrowing = InferSelectModel<typeof BorrowingsTable>;
export type NewBorrowing = InferInsertModel<typeof BorrowingsTable>;