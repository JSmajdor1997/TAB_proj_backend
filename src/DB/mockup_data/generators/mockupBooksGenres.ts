import { faker } from '@faker-js/faker';
import { NewBookGenre } from '../../schema/BooksGenresTable';
import { Book } from '../../schema/BooksTable';
import { Genre } from '../../schema/GenresTable';

export default function mockupBookGenres(books: Book[], genres: Genre[]): NewBookGenre[] {
    return books.flatMap(book =>
        faker.helpers.arrayElements(genres, { min: 0, max: genres.length }).map(genre => ({
            genreId: genre.id,
            bookId: book.id,
        }))
    );
}