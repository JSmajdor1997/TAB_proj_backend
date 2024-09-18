"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorsBooksTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const AuthorsTable_1 = require("./AuthorsTable");
const BooksTable_1 = require("./BooksTable");
exports.AuthorsBooksTable = (0, pg_core_1.pgTable)("authors_books", {
    authorId: (0, pg_core_1.serial)('author_id').references(() => AuthorsTable_1.AuthorsTable.id, { onUpdate: "cascade" }),
    bookId: (0, pg_core_1.serial)('book_id').references(() => BooksTable_1.BooksTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, (table) => {
    return {
        authorIdIndex: (0, pg_core_1.index)("author_idx").on(table.authorId),
        bookIdIndex: (0, pg_core_1.index)("book_idx").on(table.bookId),
    };
});
