import { InferInsertModel } from "drizzle-orm";
import { AuthorsTable } from "../../DB/schema/AuthorsTable";
import { LocationsTable } from "../../DB/schema/LocationsTable";
import { LibrariansTable } from "../../DB/schema/LibrariansTable";
import { LanguagesTable } from "../../DB/schema/LanguagesTable";
import { GenresTable } from "../../DB/schema/GenresTable";
import { BookItemsTable } from "../../DB/schema/BookItemsTable";
import { BooksTable } from "../../DB/schema/BooksTable";
import { StudentsTable } from "../../DB/schema/StudentsTable";

export enum CreateOneType {
    Author = "Author",
    Book = "Book",
    BookItem = "BookItem",
    Genre = "Genre",
    Language = "Language",
    Librarian = "Librarian",
    Location = "Location",
    Student = "Student",
}

export type CreateQuery<T extends CreateOneType> = (
    T extends CreateOneType.Author ? InferInsertModel<typeof AuthorsTable> :
    T extends CreateOneType.Book ? InferInsertModel<typeof BooksTable> :
    T extends CreateOneType.BookItem ? InferInsertModel<typeof BookItemsTable> :
    T extends CreateOneType.Genre ? InferInsertModel<typeof GenresTable> :
    T extends CreateOneType.Language ? InferInsertModel<typeof LanguagesTable> :
    T extends CreateOneType.Librarian ? InferInsertModel<typeof LibrariansTable> :
    T extends CreateOneType.Location ? InferInsertModel<typeof LocationsTable> :
    T extends CreateOneType.Student ? InferInsertModel<typeof StudentsTable> :
    never
)