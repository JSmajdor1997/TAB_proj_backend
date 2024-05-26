import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial } from 'drizzle-orm/pg-core';
import { AuthorsTable } from './AuthorsTable';
import { BooksTable } from './BooksTable';

export const BooksGenresTable = pgTable("books_genres", {
    genreId: serial('genre_id').references(() => AuthorsTable.id),
    bookId: serial('book_id').references(() => BooksTable.id),
})

export type BookGenre = InferSelectModel<typeof BooksGenresTable>;
export type NewBookGenre = InferInsertModel<typeof BooksGenresTable>;