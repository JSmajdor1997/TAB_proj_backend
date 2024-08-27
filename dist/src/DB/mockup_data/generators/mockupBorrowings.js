"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function mockupBorrowings(students, bookItems, librarians, fees) {
    return faker_1.faker.helpers.arrayElements(students, { min: 5, max: Math.ceil(students.length / 2) }).flatMap(student => {
        const borrowings = Array.from({ length: faker_1.faker.number.int({ min: 0, max: 100 }) }, (_) => {
            const borrowingDate = faker_1.faker.date.recent({ refDate: new Date(), days: 100 });
            const returnDate = faker_1.faker.datatype.boolean() ? faker_1.faker.date.between({ from: borrowingDate, to: new Date() }) : null;
            let paidFee = null;
            if (returnDate != null) {
                const range = returnDate.getTime() - borrowingDate.getTime();
                const ascendingFees = fees.sort((a, b) => a.rangeMsMin - b.rangeMsMin);
                if (range < ascendingFees[0].rangeMsMin) {
                    paidFee = ascendingFees[0].fee;
                }
                else if (range > ascendingFees[ascendingFees.length - 1].rangeMsMax) {
                    paidFee = ascendingFees[ascendingFees.length - 1].fee;
                }
                else {
                    const bestFit = fees.find(fee => range >= fee.rangeMsMin && range < fee.rangeMsMax);
                    if (bestFit != null) {
                        paidFee = bestFit.fee;
                    }
                }
            }
            return {
                studentId: student.id,
                bookItemEan: faker_1.faker.helpers.arrayElement(bookItems).ean,
                librarianId: faker_1.faker.helpers.arrayElement(librarians).id,
                borrowingDate,
                returnDate,
                paidFee
            };
        });
        return borrowings;
    });
}
exports.default = mockupBorrowings;
