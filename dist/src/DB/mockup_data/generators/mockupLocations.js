"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupLocations(amount) {
    return Array.from({ length: amount }, (_, index) => ({
        name: faker_1.faker.word.words({ count: 1 })
    }));
}
exports.default = mockupLocations;
