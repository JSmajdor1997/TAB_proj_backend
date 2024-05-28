import { faker } from '@faker-js/faker';
import { NewLibrarian } from '../../schema/LibrariansTable';

export default function mockupLibrarians(amount: number): NewLibrarian[] {
    return Array.from({ length: amount }, () => ({
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }));
}