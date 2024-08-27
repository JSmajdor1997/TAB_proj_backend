"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupBooks(amount) {
    return Array.from({ length: amount }, () => ({
        title: faker_1.faker.commerce.productName(),
    }));
}
exports.default = mockupBooks;
