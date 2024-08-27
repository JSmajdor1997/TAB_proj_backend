"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.LocationsTable = (0, pg_core_1.pgTable)('locations', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 256 }).notNull()
});
