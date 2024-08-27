"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassesTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.ClassesTable = (0, pg_core_1.pgTable)('classes', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 256 }).notNull(),
    startingDate: (0, pg_core_1.date)("starting_year", { mode: "date" }).notNull()
});
