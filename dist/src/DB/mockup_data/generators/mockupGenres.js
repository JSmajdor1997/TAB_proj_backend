"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupGenres(amount) {
    return Array.from({ length: amount }, (_, id) => ({
        name: faker_1.faker.commerce.department(),
        description: faker_1.faker.lorem.sentence(),
    }));
}
exports.default = mockupGenres;
