import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, pgTable, serial } from 'drizzle-orm/pg-core';
import { AuthorsTable } from './AuthorsTable';
import { BooksTable } from './BooksTable';

export const AuthorsBooksTable = pgTable("authors_books", {
    authorId: serial('author_id').references(() => AuthorsTable.id, {onUpdate: "cascade"}),
    bookId: serial('book_id').references(() => BooksTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
}, (table) => {
    return {
        authorIdIndex: index("author_idx").on(table.authorId),
        bookIdIndex: index("book_idx").on(table.bookId),
    };
})

export type AuthorBook = InferSelectModel<typeof AuthorsBooksTable>;
export type NewAuthorBook = InferInsertModel<typeof AuthorsBooksTable>;