import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, pgTable, serial } from 'drizzle-orm/pg-core';
import { AuthorsTable } from './AuthorsTable';
import { BooksTable } from './BooksTable';

export const BooksGenresTable = pgTable("books_genres", {
    genreId: serial('genre_id').references(() => AuthorsTable.id, {onUpdate: "cascade", onDelete: "cascade"}),
    bookId: serial('book_id').references(() => BooksTable.id, {onUpdate: "cascade", onDelete: "cascade"}),
}, (table) => {
    return {
        genreIdIndex: index('genre_id_idx').on(table.genreId),  // Index on genre_id
        bookIdIndex: index('book_id_idx').on(table.bookId),      // Index on bookId
    };
})

export type BookGenre = InferSelectModel<typeof BooksGenresTable>;
export type NewBookGenre = InferInsertModel<typeof BooksGenresTable>;