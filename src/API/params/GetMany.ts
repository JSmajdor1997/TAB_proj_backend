import { ReservationStatus } from "../../DB/schema/ReservationsTable";

export enum GetManyType {
    Authors = "Authors",
    BookItems = "BookItems",
    Books = "Books",
    Borrowings = "Borrowings",
    Fees = "Fees",
    Languages = "Languages",
    Librarians = "Librarians",
    Locations = "Locations",
    Reservations = "Reservations",
    Students = "Students",
    Reports = "Reports",
    Genres = "Genres",
    Classes = "Classes",
}

export type GetManyQuery<T extends GetManyType> = (
    T extends GetManyType.Authors ? { phrase?: string, bookId: number } :
    T extends GetManyType.BookItems ? { phrase?: string, languageId: number, isBorrowed: boolean | null, bookId: number } :
    T extends GetManyType.Books ? { phrase?: string } :
    T extends GetManyType.Borrowings ? { phrase?: string, studentId: number | null, returned: boolean | null } :
    T extends GetManyType.Fees ? {} :
    T extends GetManyType.Languages ? {bookId: number} :
    T extends GetManyType.Librarians ? { phrase?: string } :
    T extends GetManyType.Locations ? {} :
    T extends GetManyType.Reservations ? { status: ReservationStatus, studentId: number | null } :
    T extends GetManyType.Students ? { phrase?: string } :
    T extends GetManyType.Reports ? { } :
    T extends GetManyType.Genres ? {bookId: number } :
    T extends GetManyType.Classes ? {} :
    never
)