import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { date, integer, pgEnum, pgTable, serial } from 'drizzle-orm/pg-core';
import { BooksTable } from './BooksTable';
import { StudentsTable } from './StudentsTable';

export const ReservationStatusEnums = pgEnum('reservation_status', ['active', 'canceled', 'realized']);

export const ReservationsTable = pgTable("reservations", {
    id: serial('id').primaryKey(),
    bookId: integer("book_id").references(() => BooksTable.id).notNull(),
    date: date("date", { mode: "date" }).notNull(),
    studentId: integer("student_id").references(() => StudentsTable.id).notNull(),
    status: ReservationStatusEnums("status").notNull()
})

export enum ReservationStatus {
    Active = 'active',
    Canceled = 'canceled',
    Realized = 'realized'
}

export interface Reservation extends InferSelectModel<typeof ReservationsTable> {
    status: ReservationStatus;
}

export interface NewReservation extends InferInsertModel<typeof ReservationsTable> {
    status: ReservationStatus;
}