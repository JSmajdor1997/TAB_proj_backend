import { faker } from '@faker-js/faker';
import { NewBook } from '../../schema/BooksTable';

export default function mockupBooks(amount: number): NewBook[] {
    return Array.from({ length: amount }, () => ({
        title: faker.commerce.productName(),
    }));
}