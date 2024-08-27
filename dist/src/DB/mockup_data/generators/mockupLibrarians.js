"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupLibrarians(amount) {
    return Array.from({ length: amount }, () => ({
        name: faker_1.faker.person.firstName(),
        surname: faker_1.faker.person.lastName(),
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.internet.password(),
    }));
}
exports.default = mockupLibrarians;
