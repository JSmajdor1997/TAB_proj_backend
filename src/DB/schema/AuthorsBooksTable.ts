import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial } from 'drizzle-orm/pg-core';
import { AuthorsTable } from './AuthorsTable';
import { BooksTable } from './BooksTable';

export const AuthorsBooksTable = pgTable("authors_books", {
    authorId: serial('author_id').references(() => AuthorsTable.id),
    bookId: serial('book_id').references(() => BooksTable.id),
})

export type AuthorBook = InferSelectModel<typeof AuthorsBooksTable>;
export type NewAuthorBook = InferInsertModel<typeof AuthorsBooksTable>;