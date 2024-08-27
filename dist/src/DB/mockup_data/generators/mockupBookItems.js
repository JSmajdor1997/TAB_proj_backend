"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupBookItems(books, locations, languages) {
    return books.flatMap(book => {
        return Array.from({ length: faker_1.faker.number.int({ min: 1, max: 20 }) }, (_, id) => ({
            isbn: faker_1.faker.number.bigInt({ min: 1000000000000, max: 9999999999999 }),
            remarks: faker_1.faker.lorem.sentence(),
            bookId: book.id,
            locationId: faker_1.faker.helpers.arrayElement(locations).id,
            languageId: faker_1.faker.helpers.arrayElement(languages).id
        }));
    });
}
exports.default = mockupBookItems;
