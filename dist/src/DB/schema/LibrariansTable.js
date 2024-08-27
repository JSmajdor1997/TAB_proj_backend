"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibrariansTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.LibrariansTable = (0, pg_core_1.pgTable)('librarians', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 256 }).notNull(),
    surname: (0, pg_core_1.varchar)('surname', { length: 256 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 256 }).notNull(),
    password: (0, pg_core_1.varchar)('password', { length: 256 }).notNull()
});
