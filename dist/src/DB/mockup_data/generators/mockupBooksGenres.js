"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupBookGenres(books, genres) {
    return books.flatMap(book => faker_1.faker.helpers.arrayElements(genres, { min: 0, max: genres.length }).map(genre => ({
        genreId: genre.id,
        bookId: book.id,
    })));
}
exports.default = mockupBookGenres;
