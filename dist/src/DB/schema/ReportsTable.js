"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.ReportsTable = (0, pg_core_1.pgTable)("reports", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    startDate: (0, pg_core_1.date)("startDate", { mode: "date" }).notNull(),
    endDate: (0, pg_core_1.date)("endDate", { mode: "date" }),
    content: (0, pg_core_1.varchar)("content")
});
