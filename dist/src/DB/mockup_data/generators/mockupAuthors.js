"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupAuthors(amount) {
    return Array.from({ length: amount }, (_, id) => ({
        name: faker_1.faker.person.firstName(),
        surname: faker_1.faker.person.lastName(),
        birthDate: faker_1.faker.date.past({ refDate: new Date(), years: 50 }),
    }));
}
exports.default = mockupAuthors;
