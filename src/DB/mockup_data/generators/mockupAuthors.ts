import { faker } from '@faker-js/faker';
import { NewAuthor } from '../../schema/AuthorsTable';

export default function mockupAuthors(amount: number): NewAuthor[] {
    return Array.from({ length: amount }, (_, id) => ({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        birthDate: faker.date.past({ refDate: new Date(), years: 50 }),
    }));
}