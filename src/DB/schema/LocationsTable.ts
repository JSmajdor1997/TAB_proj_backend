import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const LocationsTable = pgTable('locations', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull()
});

export type Location = InferSelectModel<typeof LocationsTable>;
export type NewLocation = InferInsertModel<typeof LocationsTable>;