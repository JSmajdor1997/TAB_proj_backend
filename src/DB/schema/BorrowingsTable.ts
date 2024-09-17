import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import { date, index, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { BookItemsTable } from './BookItemsTable';
import { LibrariansTable } from './LibrariansTable';
import { StudentsTable } from './StudentsTable';

export const BorrowingsTable = pgTable("borrowings", {
    id: serial('id').primaryKey(),
    studentId: integer("student_id").references(() => StudentsTable.id, {onUpdate: "cascade"}).notNull(),
    bookItemEan: integer("book_item_ean").references(() => BookItemsTable.ean, {onUpdate: "cascade"}).notNull(),
    librarianId: integer("librarian_id").references(() => LibrariansTable.id, {onUpdate: "cascade"}).notNull(),
    borrowingDate: date("borrowing_date", { mode: "date" }).notNull(),
    returnDate: date("return_date", { mode: "date" }).default(sql`NULL`),
    paidFee: integer("paid_fee").default(sql`NULL`)
}, (table) => {
    return {
        // Composite index on (student_id, book_item_Id, librarian_id)
        studentCompositeIndex: index('student_idx').on(table.studentId, table.bookItemEan, table.librarianId),
        
        // Index on book_item_Id
        bookItemIdIndex: index('c1').on(table.bookItemEan),

        // Index on librarian_id
        librarianIdIndex: index('c3').on(table.librarianId)
    };
})

export type Borrowing = InferSelectModel<typeof BorrowingsTable>;
export type NewBorrowing = InferInsertModel<typeof BorrowingsTable>;