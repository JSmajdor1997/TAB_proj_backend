import { faker } from '@faker-js/faker';
import { NewAuthorBook } from '../../schema/AuthorsBooksTable';
import { Author } from '../../schema/AuthorsTable';
import { Book } from '../../schema/BooksTable';

export default function mockupAuthorsBooks(books: Book[], authors: Author[]): NewAuthorBook[] {
    return books.flatMap(book =>
        faker.helpers.arrayElements(authors, { min: 1, max: 4 }).map(author => ({
            bookId: book.id,
            authorId: author.id
        }))
    );
}