import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { PGlite } from '@electric-sql/pglite';
import getEnv from '../getEnv';
import mockupAuthors from './mockup_data/generators/mockupAuthors';
import mockupAuthorsBooks from './mockup_data/generators/mockupAuthorsBooks';
import mockupBookItems from './mockup_data/generators/mockupBookItems';
import mockupBooks from './mockup_data/generators/mockupBooks';
import mockupBookGenres from './mockup_data/generators/mockupBooksGenres';
import mockupBorrowings from './mockup_data/generators/mockupBorrowings';
import mockupClasses from './mockup_data/generators/mockupClasses';
import mockupFees from './mockup_data/generators/mockupFees';
import mockupGenres from './mockup_data/generators/mockupGenres';
import mockupLanguages from './mockup_data/generators/mockupLanguages';
import mockupLibrarians from './mockup_data/generators/mockupLibrarians';
import mockupLocations from './mockup_data/generators/mockupLocations';
import mockupReservations from './mockup_data/generators/mockupReservations';
import mockupStudents from './mockup_data/generators/mockupStudents';
import { AuthorsBooksTable } from './schema/AuthorsBooksTable';
import { AuthorsTable } from './schema/AuthorsTable';
import { BookItemsTable } from './schema/BookItemsTable';
import { BooksGenresTable } from './schema/BooksGenresTable';
import { BooksTable } from './schema/BooksTable';
import { BorrowingsTable } from './schema/BorrowingsTable';
import { ClassesTable } from './schema/ClassesTable';
import { FeesTable } from './schema/FeesTable';
import { GenresTable } from './schema/GenresTable';
import { LanguagesTable } from './schema/LanguagesTable';
import { LibrariansTable } from './schema/LibrariansTable';
import { LocationsTable } from './schema/LocationsTable';
import { ReservationsTable } from './schema/ReservationsTable';
import { StudentsTable } from './schema/StudentsTable';


export default async function getMockupDB() {
    const env = getEnv()

    //preparing databse - migrating using generated scripts
    const db = drizzle(new PGlite())
    await migrate(db, { migrationsFolder: env.MIGRATION_CATALOG });

    //all independent may be inserted at once
    await Promise.all([
        db.insert(AuthorsTable).values(mockupAuthors(30)),
        db.insert(BooksTable).values(mockupBooks(100)),
        db.insert(LocationsTable).values(mockupLocations(5)),
        db.insert(LanguagesTable).values(mockupLanguages()),
        db.insert(GenresTable).values(mockupGenres(8)),
        db.insert(ClassesTable).values(mockupClasses(20)),
        db.insert(LibrariansTable).values(mockupLibrarians(10)),
        db.insert(FeesTable).values(mockupFees())
    ])

    const [authors, books, locations, languages, genres, classes, librarians, fees] = await Promise.all([
        db.select().from(AuthorsTable),
        db.select().from(BooksTable),
        db.select().from(LocationsTable),
        db.select().from(LanguagesTable),
        db.select().from(GenresTable),
        db.select().from(ClassesTable),
        db.select().from(LibrariansTable),
        db.select().from(FeesTable),
    ])

    await db.insert(StudentsTable).values(mockupStudents(200, classes))
    const students = await db.select().from(StudentsTable)

    await db.insert(BookItemsTable).values(mockupBookItems(books, locations, languages))
    const booksItems = await db.select().from(BookItemsTable)

    const borrowings = mockupBorrowings(students, booksItems, librarians, fees)
    await db.insert(BorrowingsTable).values(borrowings)

    const reservations = mockupReservations(books, students)
    await db.insert(ReservationsTable).values(reservations)

    const booksGenres = mockupBookGenres(books, genres)
    await db.insert(BooksGenresTable).values(booksGenres)

    const authorsBooks = mockupAuthorsBooks(books, authors)
    await db.insert(AuthorsBooksTable).values(authorsBooks)

    return db
}