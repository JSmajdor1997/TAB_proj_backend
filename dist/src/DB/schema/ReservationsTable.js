"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationStatus = exports.ReservationsTable = exports.ReservationStatusEnums = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const BooksTable_1 = require("./BooksTable");
const StudentsTable_1 = require("./StudentsTable");
exports.ReservationStatusEnums = (0, pg_core_1.pgEnum)('reservation_status', ['active', 'canceled', 'realized']);
exports.ReservationsTable = (0, pg_core_1.pgTable)("reservations", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    bookId: (0, pg_core_1.integer)("book_id").references(() => BooksTable_1.BooksTable.id, { onDelete: "cascade", onUpdate: "cascade" }).notNull(),
    date: (0, pg_core_1.date)("date", { mode: "date" }).notNull(),
    studentId: (0, pg_core_1.integer)("student_id").references(() => StudentsTable_1.StudentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }).notNull(),
    status: (0, exports.ReservationStatusEnums)("status").notNull().default("active")
});
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["Active"] = "active";
    ReservationStatus["Canceled"] = "canceled";
    ReservationStatus["Realized"] = "realized";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
