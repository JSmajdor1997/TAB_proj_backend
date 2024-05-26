import { faker } from '@faker-js/faker';
import { NewReservation, ReservationStatus } from "../../schema/ReservationsTable";
import { Book } from '../../schema/BooksTable';
import { Student } from '../../schema/StudentsTable';

export default function mockupReservations(books: Book[], students: Student[]): NewReservation[] {
    return students.flatMap(student => faker.helpers.arrayElements(books, { min: 0, max: 5 }).flatMap((book, bookIndex) => ({
        bookId: book.id,
        date: faker.date.recent({ refDate: new Date(), days: 500 }),
        studentId: student.id,
        status: faker.helpers.arrayElement([ReservationStatus.Active, ReservationStatus.Canceled, ReservationStatus.Realized])
    })))
}