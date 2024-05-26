import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { StudentsTable } from './StudentsTable';

export const MessagesTable = pgTable('messages', {
    id: serial('id').primaryKey(),
    date: date("date", { mode: "date" }).notNull(),
    content: varchar('content', { length: 512 }).notNull(),
    isFromLibrarian: boolean('is_from_librarian').notNull(),
    studentId: integer("student_id").references(() => StudentsTable.id).notNull()
});

export type Message = InferSelectModel<typeof MessagesTable>;
export type NewMessage = InferInsertModel<typeof MessagesTable>;