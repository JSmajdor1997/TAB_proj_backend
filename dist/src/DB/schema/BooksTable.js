"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.BooksTable = (0, pg_core_1.pgTable)('books', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 256 }).notNull(),
});
