import { ReservationStatus, ReservationStatusEnums } from "../../DB/schema/ReservationsTable";

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
    Students = "Students"
}

export type GetManyQuery<T extends GetManyType> = (
    T extends GetManyType.Authors ? { phrase?: string } :
    T extends GetManyType.BookItems ? { phrase?: string, languageId: number, isBorrowed: boolean | null } :
    T extends GetManyType.Books ? { phrase?: string } :
    T extends GetManyType.Borrowings ? { phrase?: string } :
    T extends GetManyType.Fees ? {} :
    T extends GetManyType.Languages ? {} :
    T extends GetManyType.Librarians ? { phrase?: string } :
    T extends GetManyType.Locations ? {} :
    T extends GetManyType.Reservations ? { status: ReservationStatus } :
    T extends GetManyType.Students ? { phrase?: string } :
    never
)