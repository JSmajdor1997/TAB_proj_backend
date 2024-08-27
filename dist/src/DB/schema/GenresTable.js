"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenresTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.GenresTable = (0, pg_core_1.pgTable)('genres', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 256 }).notNull(),
    description: (0, pg_core_1.varchar)('description', { length: 512 }).notNull(),
});
