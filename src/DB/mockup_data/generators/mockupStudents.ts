import { faker } from '@faker-js/faker';
import { Class } from '../../schema/ClassesTable';
import { NewStudent } from '../../schema/StudentsTable';

export default function mockupStudents(amount: number, classes: Class[]): NewStudent[] {
    return Array.from({ length: amount }, (_, id) => ({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        birthDate: faker.date.past({ refDate: new Date(2010, 0, 1), years: 18 }),
        addedDate: faker.date.recent({ refDate: 365 }),
        classId: faker.helpers.arrayElement(classes).id,
        email: faker.internet.email(),
        password: faker.string.alpha({ length: { min: 8, max: 25 } })
    }));
}