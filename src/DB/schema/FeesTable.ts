import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { bigint, integer, pgTable } from 'drizzle-orm/pg-core';

export const FeesTable = pgTable('fees', {
    rangeMsMin: bigint('rangeMsMin', { mode: "number" }).notNull(),
    rangeMsMax: bigint('rangeMsMax', { mode: "number" }).notNull(),
    fee: integer('fee').notNull(),
});

export type Fee = InferSelectModel<typeof FeesTable>;
export type NewFee = InferInsertModel<typeof FeesTable>;