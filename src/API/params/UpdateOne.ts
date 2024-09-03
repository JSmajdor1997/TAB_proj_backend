export enum UpdateOneType {
    Author = "Author",
    Book = "Book",
    BookItem = "BookItem",
    Fees = "Fees",
    Genre = "Genre",
    Language = "Language",
    Location = "Location",
    Student = "Student"
}

export type UpdateQuery<T extends UpdateOneType> = (
    T extends UpdateOneType.Author ? {} :
    T extends UpdateOneType.Book ? {} :
    T extends UpdateOneType.BookItem ? {} :
    T extends UpdateOneType.Genre ? {} :
    T extends UpdateOneType.Language ? {} :
    T extends UpdateOneType.Location ? {} :
    T extends UpdateOneType.Student ? {} :
    never
)