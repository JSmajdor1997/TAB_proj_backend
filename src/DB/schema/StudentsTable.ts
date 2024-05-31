import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { ClassesTable } from './ClassesTable';

export const StudentsTable = pgTable('students', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    surname: varchar('surname', { length: 256 }).notNull(),
    birthDate: date("birth_date", { mode: "date" }).notNull(),
    addedDate: date("added_date", { mode: "date" }).notNull().defaultNow(),
    classId: integer("class_id").references(() => ClassesTable.id).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
});

export type Student = InferSelectModel<typeof StudentsTable>;
export type NewStudent = InferInsertModel<typeof StudentsTable>;