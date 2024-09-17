import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { date, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const ReportsTable = pgTable("reports", {
    id: serial('id').primaryKey(),
    startDate: date("startDate", { mode: "date" }).notNull(),
    endDate: date("endDate", { mode: "date" }),
    content: varchar("content")
})

export type Report = InferSelectModel<typeof ReportsTable>;
export type NewReport = InferInsertModel<typeof ReportsTable>;