"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pglite_1 = require("drizzle-orm/pglite");
const migrator_1 = require("drizzle-orm/pglite/migrator");
const pglite_2 = require("@electric-sql/pglite");
const getEnv_1 = __importDefault(require("../getEnv"));
const mockupAuthors_1 = __importDefault(require("./mockup_data/generators/mockupAuthors"));
const mockupAuthorsBooks_1 = __importDefault(require("./mockup_data/generators/mockupAuthorsBooks"));
const mockupBookItems_1 = __importDefault(require("./mockup_data/generators/mockupBookItems"));
const mockupBooks_1 = __importDefault(require("./mockup_data/generators/mockupBooks"));
const mockupBooksGenres_1 = __importDefault(require("./mockup_data/generators/mockupBooksGenres"));
const mockupBorrowings_1 = __importDefault(require("./mockup_data/generators/mockupBorrowings"));
const mockupClasses_1 = __importDefault(require("./mockup_data/generators/mockupClasses"));
const mockupFees_1 = __importDefault(require("./mockup_data/generators/mockupFees"));
const mockupGenres_1 = __importDefault(require("./mockup_data/generators/mockupGenres"));
const mockupLanguages_1 = __importDefault(require("./mockup_data/generators/mockupLanguages"));
const mockupLibrarians_1 = __importDefault(require("./mockup_data/generators/mockupLibrarians"));
const mockupLocations_1 = __importDefault(require("./mockup_data/generators/mockupLocations"));
const mockupReservations_1 = __importDefault(require("./mockup_data/generators/mockupReservations"));
const mockupStudents_1 = __importDefault(require("./mockup_data/generators/mockupStudents"));
const AuthorsBooksTable_1 = require("./schema/AuthorsBooksTable");
const AuthorsTable_1 = require("./schema/AuthorsTable");
const BookItemsTable_1 = require("./schema/BookItemsTable");
const BooksGenresTable_1 = require("./schema/BooksGenresTable");
const BooksTable_1 = require("./schema/BooksTable");
const BorrowingsTable_1 = require("./schema/BorrowingsTable");
const ClassesTable_1 = require("./schema/ClassesTable");
const FeesTable_1 = require("./schema/FeesTable");
const GenresTable_1 = require("./schema/GenresTable");
const LanguagesTable_1 = require("./schema/LanguagesTable");
const LibrariansTable_1 = require("./schema/LibrariansTable");
const LocationsTable_1 = require("./schema/LocationsTable");
const ReservationsTable_1 = require("./schema/ReservationsTable");
const StudentsTable_1 = require("./schema/StudentsTable");
function getMockupDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const env = (0, getEnv_1.default)();
        //preparing databse - migrating using generated scripts
        const db = (0, pglite_1.drizzle)(new pglite_2.PGlite());
        yield (0, migrator_1.migrate)(db, { migrationsFolder: env.MIGRATION_CATALOG });
        //all independent may be inserted at once
        yield Promise.all([
            db.insert(AuthorsTable_1.AuthorsTable).values((0, mockupAuthors_1.default)(30)),
            db.insert(BooksTable_1.BooksTable).values((0, mockupBooks_1.default)(100)),
            db.insert(LocationsTable_1.LocationsTable).values((0, mockupLocations_1.default)(5)),
            db.insert(LanguagesTable_1.LanguagesTable).values((0, mockupLanguages_1.default)()),
            db.insert(GenresTable_1.GenresTable).values((0, mockupGenres_1.default)(8)),
            db.insert(ClassesTable_1.ClassesTable).values((0, mockupClasses_1.default)(20)),
            db.insert(LibrariansTable_1.LibrariansTable).values((0, mockupLibrarians_1.default)(10)),
            db.insert(FeesTable_1.FeesTable).values((0, mockupFees_1.default)())
        ]);
        const [authors, books, locations, languages, genres, classes, librarians, fees] = yield Promise.all([
            db.select().from(AuthorsTable_1.AuthorsTable),
            db.select().from(BooksTable_1.BooksTable),
            db.select().from(LocationsTable_1.LocationsTable),
            db.select().from(LanguagesTable_1.LanguagesTable),
            db.select().from(GenresTable_1.GenresTable),
            db.select().from(ClassesTable_1.ClassesTable),
            db.select().from(LibrariansTable_1.LibrariansTable),
            db.select().from(FeesTable_1.FeesTable),
        ]);
        yield db.insert(StudentsTable_1.StudentsTable).values((0, mockupStudents_1.default)(200, classes));
        const students = yield db.select().from(StudentsTable_1.StudentsTable);
        yield db.insert(BookItemsTable_1.BookItemsTable).values((0, mockupBookItems_1.default)(books, locations, languages));
        const booksItems = yield db.select().from(BookItemsTable_1.BookItemsTable);
        const borrowings = (0, mockupBorrowings_1.default)(students, booksItems, librarians, fees);
        yield db.insert(BorrowingsTable_1.BorrowingsTable).values(borrowings);
        const reservations = (0, mockupReservations_1.default)(books, students);
        yield db.insert(ReservationsTable_1.ReservationsTable).values(reservations);
        const booksGenres = (0, mockupBooksGenres_1.default)(books, genres);
        yield db.insert(BooksGenresTable_1.BooksGenresTable).values(booksGenres);
        const authorsBooks = (0, mockupAuthorsBooks_1.default)(books, authors);
        yield db.insert(AuthorsBooksTable_1.AuthorsBooksTable).values(authorsBooks);
        return db;
    });
}
exports.default = getMockupDB;
