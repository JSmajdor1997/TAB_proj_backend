import { faker } from '@faker-js/faker';
import { NewBookItem } from '../../schema/BookItemsTable';
import { Book } from '../../schema/BooksTable';
import { Language } from '../../schema/LanguagesTable';
import { Location } from '../../schema/LocationsTable';

export default function mockupBookItems(books: Book[], locations: Location[], languages: Language[]): NewBookItem[] {
    return books.flatMap(book => {
        return Array.from({ length: faker.number.int({ min: 1, max: 20 }) }, (_, id) => ({
            isbn: faker.number.bigInt({ min: 1000000000000, max: 9999999999999 }),
            remarks: faker.lorem.sentence(),
            bookId: book.id,
            locationId: faker.helpers.arrayElement(locations).id,
            languageId: faker.helpers.arrayElement(languages).id
        }));
    });
}