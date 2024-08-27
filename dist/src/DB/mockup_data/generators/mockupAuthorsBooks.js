"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupAuthorsBooks(books, authors) {
    return books.flatMap(book => faker_1.faker.helpers.arrayElements(authors, { min: 1, max: 4 }).map(author => ({
        bookId: book.id,
        authorId: author.id
    })));
}
exports.default = mockupAuthorsBooks;
