"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupStudents(amount, classes) {
    return Array.from({ length: amount }, (_, id) => ({
        name: faker_1.faker.person.firstName(),
        surname: faker_1.faker.person.lastName(),
        birthDate: faker_1.faker.date.past({ refDate: new Date(2010, 0, 1), years: 18 }),
        addedDate: faker_1.faker.date.recent({ refDate: 365 }),
        classId: faker_1.faker.helpers.arrayElement(classes).id,
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.string.alpha({ length: { min: 8, max: 25 } })
    }));
}
exports.default = mockupStudents;
