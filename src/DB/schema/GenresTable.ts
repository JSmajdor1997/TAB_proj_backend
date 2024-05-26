import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const GenresTable = pgTable('genres', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: varchar('description', { length: 512 }).notNull(),
});

export type Genre = InferSelectModel<typeof GenresTable>;
export type NewGenre = InferInsertModel<typeof GenresTable>;