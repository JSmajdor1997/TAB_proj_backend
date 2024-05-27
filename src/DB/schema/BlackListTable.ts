import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { date, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const BlackListTable = pgTable('black_list', {
    token: varchar('token', { length: 256 }).notNull().primaryKey(),
});

export type BlackList = InferSelectModel<typeof BlackListTable>;