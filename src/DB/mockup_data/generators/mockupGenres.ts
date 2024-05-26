import { faker } from '@faker-js/faker';
import { NewGenre } from '../../schema/GenresTable';

export default function mockupGenres(amount: number): NewGenre[] {
    return Array.from({ length: amount }, (_, id) => ({
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
    }));
}