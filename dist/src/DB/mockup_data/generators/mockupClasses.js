"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupClasses(amount) {
    return Array.from({ length: amount }, (_, id) => ({
        name: `Class ${faker_1.faker.number.int({ min: 1, max: 9 })}`,
        startingDate: faker_1.faker.date.past({ refDate: new Date(), years: 9 }),
    }));
}
exports.default = mockupClasses;
