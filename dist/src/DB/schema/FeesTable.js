"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.FeesTable = (0, pg_core_1.pgTable)('fees', {
    rangeMsMin: (0, pg_core_1.bigint)('rangeMsMin', { mode: "number" }).notNull(),
    rangeMsMax: (0, pg_core_1.bigint)('rangeMsMax', { mode: "number" }).notNull(),
    fee: (0, pg_core_1.integer)('fee').notNull(),
});
