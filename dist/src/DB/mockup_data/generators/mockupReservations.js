"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const ReservationsTable_1 = require("../../schema/ReservationsTable");
function mockupReservations(books, students) {
    return students.flatMap(student => faker_1.faker.helpers.arrayElements(books, { min: 0, max: 5 }).flatMap((book, bookIndex) => ({
        bookId: book.id,
        date: faker_1.faker.date.recent({ refDate: new Date(), days: 500 }),
        studentId: student.id,
        status: faker_1.faker.helpers.arrayElement([ReservationsTable_1.ReservationStatus.Active, ReservationsTable_1.ReservationStatus.Canceled, ReservationsTable_1.ReservationStatus.Realized])
    })));
}
exports.default = mockupReservations;
