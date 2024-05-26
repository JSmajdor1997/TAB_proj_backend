import { faker } from '@faker-js/faker';
import { BookItem } from '../../schema/BookItemsTable';
import { NewBorrowing } from '../../schema/BorrowingsTable';
import { Fee } from '../../schema/FeesTable';
import { Librarian } from '../../schema/LibrariansTable';
import { Student } from '../../schema/StudentsTable';

export default function mockupBorrowings(students: Student[], bookItems: BookItem[], librarians: Librarian[], fees: Fee[]): NewBorrowing[] {
    return faker.helpers.arrayElements(students, {min: 5, max: Math.ceil(students.length/2)}).flatMap(student => {
        const borrowings = Array.from({ length: faker.number.int({ min: 0, max: 100 }) }, (_)=>{
            const borrowingDate = faker.date.recent({ refDate: new Date(), days: 100 })
            const returnDate = faker.datatype.boolean() ? faker.date.between({ from: borrowingDate, to: new Date() }) : null

            let paidFee: number | null = null
            if (returnDate != null) {
                const range = returnDate.getTime() - borrowingDate.getTime()
                const ascendingFees = fees.sort((a, b) => a.rangeMsMin - b.rangeMsMin)
                if (range < ascendingFees[0].rangeMsMin) {
                    paidFee = ascendingFees[0].fee
                } else if (range > ascendingFees[ascendingFees.length - 1].rangeMsMax) {
                    paidFee = ascendingFees[ascendingFees.length - 1].fee
                } else {
                    const bestFit = fees.find(fee => range >= fee.rangeMsMin && range < fee.rangeMsMax)
                    if (bestFit != null) {
                        paidFee = bestFit.fee
                    }
                }
            }

            return {
                studentId: student.id,
                bookItemEan: faker.helpers.arrayElement(bookItems).ean,
                librarianId: faker.helpers.arrayElement(librarians).id,
                borrowingDate,
                returnDate,
                paidFee
            }
        })

        return borrowings
    })
}