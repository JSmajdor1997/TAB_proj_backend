"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const ClassesTable_1 = require("./ClassesTable");
exports.StudentsTable = (0, pg_core_1.pgTable)('students', {
    id: (0, pg_core_1.serial)('id').primaryKey().notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 256 }).notNull(),
    surname: (0, pg_core_1.varchar)('surname', { length: 256 }).notNull(),
    birthDate: (0, pg_core_1.date)("birth_date", { mode: "date" }).notNull(),
    addedDate: (0, pg_core_1.date)("added_date", { mode: "date" }).notNull().defaultNow(),
    classId: (0, pg_core_1.integer)("class_id").references(() => ClassesTable_1.ClassesTable.id, { onUpdate: "cascade" }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 256 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 256 }).notNull(),
});
