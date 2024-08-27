"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.AuthorsTable = (0, pg_core_1.pgTable)('authors', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 256 }).notNull(),
    surname: (0, pg_core_1.varchar)('surname', { length: 256 }).notNull(),
    birthDate: (0, pg_core_1.date)("birth_date", { mode: "date" }).notNull()
});
