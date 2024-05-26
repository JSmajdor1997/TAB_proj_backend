import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const LanguagesTable = pgTable('languages', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
});

export type Language = InferSelectModel<typeof LanguagesTable>;
export type NewLanguage = InferInsertModel<typeof LanguagesTable>;