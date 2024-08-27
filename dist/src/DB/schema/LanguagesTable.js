"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguagesTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.LanguagesTable = (0, pg_core_1.pgTable)('languages', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    code: (0, pg_core_1.varchar)('code', { length: 256 }).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 256 }).notNull(),
});
