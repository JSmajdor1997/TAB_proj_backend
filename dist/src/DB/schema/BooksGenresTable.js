"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksGenresTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const AuthorsTable_1 = require("./AuthorsTable");
const BooksTable_1 = require("./BooksTable");
exports.BooksGenresTable = (0, pg_core_1.pgTable)("books_genres", {
    genreId: (0, pg_core_1.serial)('genre_id').references(() => AuthorsTable_1.AuthorsTable.id),
    bookId: (0, pg_core_1.serial)('book_id').references(() => BooksTable_1.BooksTable.id),
});
