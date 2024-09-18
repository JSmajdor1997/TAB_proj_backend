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
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const AuthorsBooksTable_1 = require("../DB/schema/AuthorsBooksTable");
const AuthorsTable_1 = require("../DB/schema/AuthorsTable");
const BookItemsTable_1 = require("../DB/schema/BookItemsTable");
const BooksGenresTable_1 = require("../DB/schema/BooksGenresTable");
const BooksTable_1 = require("../DB/schema/BooksTable");
const BorrowingsTable_1 = require("../DB/schema/BorrowingsTable");
const FeesTable_1 = require("../DB/schema/FeesTable");
const GenresTable_1 = require("../DB/schema/GenresTable");
const LanguagesTable_1 = require("../DB/schema/LanguagesTable");
const LibrariansTable_1 = require("../DB/schema/LibrariansTable");
const LocationsTable_1 = require("../DB/schema/LocationsTable");
const ReportsTable_1 = require("../DB/schema/ReportsTable");
const ReservationsTable_1 = require("../DB/schema/ReservationsTable");
const StudentsTable_1 = require("../DB/schema/StudentsTable");
const LogLevel_1 = __importDefault(require("../Logger/LogLevel"));
const CreateOne_1 = require("./params/CreateOne");
const DeleteOne_1 = require("./params/DeleteOne");
const GetMany_1 = require("./params/GetMany");
const GetOne_1 = require("./params/GetOne");
const UpdateOne_1 = require("./params/UpdateOne");
const ClassesTable_1 = require("../DB/schema/ClassesTable");
//abstracts away DB operations
class API {
    static takeOneOrNull(values) {
        if (values.length == 1) {
            return values[0];
        }
        return null;
    }
    static hashPassword(password) {
        return bcrypt_1.default.hash(password, bcrypt_1.default.genSaltSync(10));
    }
    constructor(db, logger) {
        //create defaults users if do not exist
        this.db = db;
        this.logger = logger;
        this.requestReportCreation = () => __awaiter(this, void 0, void 0, function* () { throw "ToDo"; });
        this.downloadReport = () => __awaiter(this, void 0, void 0, function* () { throw "ToDo"; });
        this.getAllGeneratedReports = () => __awaiter(this, void 0, void 0, function* () { throw "ToDo"; });
        this.resetPassword = () => __awaiter(this, void 0, void 0, function* () {
            throw "ToDo";
        });
        this.getStudent = (_a) => __awaiter(this, [_a], void 0, function* ({ email, id, password }) {
            const where = [];
            if (email != null) {
                where.push((0, drizzle_orm_1.eq)(StudentsTable_1.StudentsTable.email, email));
            }
            if (id != null) {
                where.push((0, drizzle_orm_1.eq)(StudentsTable_1.StudentsTable.id, id));
            }
            return this.db.select().from(StudentsTable_1.StudentsTable).where((0, drizzle_orm_1.and)(...where))
                .then(API.takeOneOrNull)
                .then(librarian => {
                if (librarian == null) {
                    return null;
                }
                if (password != null && !bcrypt_1.default.compareSync(password, librarian.password)) {
                    return null;
                }
                return librarian;
            });
        });
        this.getLibrarian = (_b) => __awaiter(this, [_b], void 0, function* ({ email, id, password }) {
            const where = [];
            if (email != null) {
                where.push((0, drizzle_orm_1.eq)(LibrariansTable_1.LibrariansTable.email, email));
            }
            if (id != null) {
                where.push((0, drizzle_orm_1.eq)(LibrariansTable_1.LibrariansTable.id, id));
            }
            return this.db.select().from(LibrariansTable_1.LibrariansTable).where((0, drizzle_orm_1.and)(...where))
                .then(API.takeOneOrNull)
                .then(librarian => {
                if (librarian == null) {
                    return null;
                }
                if (password != null && !bcrypt_1.default.compareSync(password, librarian.password)) {
                    return null;
                }
                return librarian;
            });
        });
        this.setPassword = (librarian, newPassword) => __awaiter(this, void 0, void 0, function* () {
            this.logger.log(LogLevel_1.default.Warning, "changing password not implemented");
            throw new Error("ToDo!");
        });
        this.returnBookItem = (bookItemId, fee) => __awaiter(this, void 0, void 0, function* () {
            //sprawdź czy w ogóle jest do zwrotu
            const borrowingItem = yield this.db.select().from(BorrowingsTable_1.BorrowingsTable).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.bookItemEan, bookItemId), (0, drizzle_orm_1.isNull)(BorrowingsTable_1.BorrowingsTable.returnDate)));
            if (borrowingItem.length != 1) {
                return {
                    error: "Book is already returned"
                };
            }
            yield this.db.update(BorrowingsTable_1.BorrowingsTable).set({ returnDate: new Date(), paidFee: fee }).where((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.id, borrowingItem[0].id));
            return {
                data: {}
            };
        });
        this.reserveBook = (studentId, bookId) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(ReservationsTable_1.ReservationsTable).values({ bookId, date: new Date(), studentId }).returning();
            return {
                data: {
                    reservationId: result[0].id
                }
            };
        });
        this.cancelReservation = (reservationId) => __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(ReservationsTable_1.ReservationsTable).set({ status: "canceled" }).where((0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.id, reservationId));
            return { data: {} };
        });
        this.lendBook = (librarianId, studentId, bookItemId) => __awaiter(this, void 0, void 0, function* () {
            //sprawdź czy możesz (czy się )
            //dodaj nowe wypożyczenie
            //usuń rezerwację jeśli jest
            //checking if available
            const result = this.db.select().from(BorrowingsTable_1.BorrowingsTable).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.bookItemEan, bookItemId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.isNull)(BorrowingsTable_1.BorrowingsTable.returnDate))));
            if (result == null) {
                return {
                    error: "Book is already lent"
                };
            }
            const bookId = (yield this.db.select({ bookId: BookItemsTable_1.BookItemsTable.bookId }).from(BookItemsTable_1.BookItemsTable).where((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.ean, bookItemId)))[0].bookId;
            const reservation = yield this.db.select().from(ReservationsTable_1.ReservationsTable).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.bookId, bookId), (0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.studentId, studentId), (0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.status, "active")));
            if (reservation.length == 1) {
                yield this.db.update(ReservationsTable_1.ReservationsTable).set({ status: "realized" }).where((0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.id, reservation[0].id));
            }
            const borrowing = yield this.db.insert(BorrowingsTable_1.BorrowingsTable).values({
                studentId,
                bookItemEan: bookItemId,
                librarianId,
                borrowingDate: new Date(),
            }).returning();
            return {
                data: {
                    borrowingId: borrowing[0].id
                }
            };
        });
        this.createOne = (type, obj) => __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case CreateOne_1.CreateOneType.Author: {
                    return this.db.insert(AuthorsTable_1.AuthorsTable).values(obj).returning().then(it => ({
                        data: {
                            createdId: it[0].id
                        }
                    }));
                }
                case CreateOne_1.CreateOneType.Report: {
                    return this.db.insert(ReportsTable_1.ReportsTable).values(obj).returning().then(it => ({
                        data: {
                            createdId: it[0].id
                        }
                    }));
                }
                case CreateOne_1.CreateOneType.Book: {
                    return this.db.insert(BooksTable_1.BooksTable).values(obj).returning().then(it => ({
                        data: {
                            createdId: it[0].id
                        }
                    }));
                }
                case CreateOne_1.CreateOneType.BookItem: {
                    return this.db.insert(BookItemsTable_1.BookItemsTable).values(obj).returning().then(it => ({
                        data: {
                            createdId: it[0].ean
                        }
                    }));
                }
                case CreateOne_1.CreateOneType.Genre: {
                    return this.db.insert(GenresTable_1.GenresTable).values(obj).returning().then(it => ({
                        data: {
                            createdId: it[0].id
                        }
                    }));
                }
                case CreateOne_1.CreateOneType.Language: {
                    return this.db.insert(LanguagesTable_1.LanguagesTable).values(obj).returning().then(it => ({
                        data: {
                            createdId: it[0].id
                        }
                    }));
                }
                case CreateOne_1.CreateOneType.Librarian: {
                    return this.db.insert(LibrariansTable_1.LibrariansTable).values(obj).returning().then(it => ({
                        data: {
                            createdId: it[0].id
                        }
                    }));
                }
                case CreateOne_1.CreateOneType.Location: {
                    return this.db.insert(LocationsTable_1.LocationsTable).values(obj).returning().then(it => ({
                        data: {
                            createdId: it[0].id
                        }
                    }));
                }
                case CreateOne_1.CreateOneType.Student: {
                    const rawUser = obj;
                    return API.hashPassword(rawUser.password).then(hashedPassword => this.db.insert(StudentsTable_1.StudentsTable).values(Object.assign(Object.assign({}, obj), { password: hashedPassword, email: rawUser.email.toLocaleLowerCase() })).returning().then(it => ({
                        data: {
                            createdId: it[0].id
                        }
                    })));
                }
                default: {
                    throw new Error("Invalid type");
                }
            }
        });
        this.deleteOne = (type, id) => __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case DeleteOne_1.DeleteOneType.Author: {
                    yield this.db.delete(AuthorsTable_1.AuthorsTable).where((0, drizzle_orm_1.eq)(AuthorsTable_1.AuthorsTable.id, id));
                    break;
                }
                case DeleteOne_1.DeleteOneType.Book: {
                    yield this.db.delete(BooksTable_1.BooksTable).where((0, drizzle_orm_1.eq)(BooksTable_1.BooksTable.id, id));
                    break;
                }
                case DeleteOne_1.DeleteOneType.BookItem: {
                    yield this.db.delete(BookItemsTable_1.BookItemsTable).where((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.ean, id));
                    break;
                }
                case DeleteOne_1.DeleteOneType.Genre: {
                    yield this.db.delete(GenresTable_1.GenresTable).where((0, drizzle_orm_1.eq)(GenresTable_1.GenresTable.id, id));
                    break;
                }
                case DeleteOne_1.DeleteOneType.Language: {
                    yield this.db.delete(LanguagesTable_1.LanguagesTable).where((0, drizzle_orm_1.eq)(LanguagesTable_1.LanguagesTable.id, id));
                    break;
                }
                case DeleteOne_1.DeleteOneType.Fees: {
                    yield this.db.delete(FeesTable_1.FeesTable).where((0, drizzle_orm_1.eq)(FeesTable_1.FeesTable.fee, id));
                    break;
                }
                case DeleteOne_1.DeleteOneType.Location: {
                    yield this.db.delete(LocationsTable_1.LocationsTable).where((0, drizzle_orm_1.eq)(LocationsTable_1.LocationsTable.id, id));
                    break;
                }
                default: {
                    throw new Error("Invalid type");
                }
            }
            return {
                data: {}
            };
        });
        this.updateOne = (type, id, obj) => __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case UpdateOne_1.UpdateOneType.Author: {
                    yield this.db.update(AuthorsTable_1.AuthorsTable).set(obj).where((0, drizzle_orm_1.eq)(AuthorsTable_1.AuthorsTable.id, id));
                    break;
                }
                case UpdateOne_1.UpdateOneType.Book: {
                    yield this.db.update(BooksTable_1.BooksTable).set(obj).where((0, drizzle_orm_1.eq)(BooksTable_1.BooksTable.id, id));
                    break;
                }
                case UpdateOne_1.UpdateOneType.BookItem: {
                    yield this.db.update(BookItemsTable_1.BookItemsTable).set(obj).where((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.ean, id));
                    break;
                }
                case UpdateOne_1.UpdateOneType.Fees: {
                    yield this.db.update(FeesTable_1.FeesTable).set(obj).where((0, drizzle_orm_1.eq)(FeesTable_1.FeesTable.fee, id));
                    break;
                }
                case UpdateOne_1.UpdateOneType.Genre: {
                    yield this.db.update(GenresTable_1.GenresTable).set(obj).where((0, drizzle_orm_1.eq)(GenresTable_1.GenresTable.id, id));
                    break;
                }
                case UpdateOne_1.UpdateOneType.Language: {
                    yield this.db.update(LanguagesTable_1.LanguagesTable).set(obj).where((0, drizzle_orm_1.eq)(LanguagesTable_1.LanguagesTable.id, id));
                    break;
                }
                case UpdateOne_1.UpdateOneType.Location: {
                    yield this.db.update(LocationsTable_1.LocationsTable).set(obj).where((0, drizzle_orm_1.eq)(LocationsTable_1.LocationsTable.id, id));
                    break;
                }
                case UpdateOne_1.UpdateOneType.Student: {
                    yield this.db.update(StudentsTable_1.StudentsTable).set(obj).where((0, drizzle_orm_1.eq)(StudentsTable_1.StudentsTable.id, id));
                    break;
                }
                default: {
                    throw new Error("Invalid type");
                }
            }
            return {
                data: {}
            };
        });
        this.getOne = (type, id) => __awaiter(this, void 0, void 0, function* () {
            let items;
            switch (type) {
                case GetOne_1.GetOneType.Author: {
                    items = yield this.db.select().from(AuthorsTable_1.AuthorsTable).where((0, drizzle_orm_1.eq)(AuthorsTable_1.AuthorsTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.Class: {
                    items = yield this.db.select().from(ClassesTable_1.ClassesTable).where((0, drizzle_orm_1.eq)(ClassesTable_1.ClassesTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.Report: {
                    items = yield this.db.select().from(ReportsTable_1.ReportsTable).where((0, drizzle_orm_1.eq)(ReportsTable_1.ReportsTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.Borrowing: {
                    items = yield this.db.select().from(BorrowingsTable_1.BorrowingsTable).where((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.Reservation: {
                    items = yield this.db.select().from(ReservationsTable_1.ReservationsTable).where((0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.Genre: {
                    items = yield this.db.select().from(GenresTable_1.GenresTable).where((0, drizzle_orm_1.eq)(GenresTable_1.GenresTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.Librarian: {
                    items = yield this.db.select().from(LibrariansTable_1.LibrariansTable).where((0, drizzle_orm_1.eq)(LibrariansTable_1.LibrariansTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.Student: {
                    items = yield this.db.select().from(StudentsTable_1.StudentsTable).where((0, drizzle_orm_1.eq)(StudentsTable_1.StudentsTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.Book: {
                    items = yield this.db.select().from(BooksTable_1.BooksTable).where((0, drizzle_orm_1.eq)(BooksTable_1.BooksTable.id, id));
                    break;
                }
                case GetOne_1.GetOneType.BookItem: {
                    items = yield this.db.select({
                        bookItem: BookItemsTable_1.BookItemsTable,
                        language: LanguagesTable_1.LanguagesTable,
                        location: LocationsTable_1.LocationsTable,
                        author: AuthorsTable_1.AuthorsTable,
                        genre: GenresTable_1.GenresTable,
                        book: BooksTable_1.BooksTable
                    })
                        .from(BookItemsTable_1.BookItemsTable)
                        .leftJoin(LanguagesTable_1.LanguagesTable, (0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.languageId, LanguagesTable_1.LanguagesTable.id))
                        .leftJoin(LocationsTable_1.LocationsTable, (0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.locationId, LocationsTable_1.LocationsTable.id))
                        .leftJoin(AuthorsBooksTable_1.AuthorsBooksTable, (0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.bookId, AuthorsBooksTable_1.AuthorsBooksTable.bookId))
                        .leftJoin(AuthorsTable_1.AuthorsTable, (0, drizzle_orm_1.eq)(AuthorsBooksTable_1.AuthorsBooksTable.authorId, AuthorsTable_1.AuthorsTable.id))
                        .leftJoin(BooksGenresTable_1.BooksGenresTable, (0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.bookId, BooksGenresTable_1.BooksGenresTable.bookId))
                        .leftJoin(GenresTable_1.GenresTable, (0, drizzle_orm_1.eq)(BooksGenresTable_1.BooksGenresTable.genreId, GenresTable_1.GenresTable.id))
                        .leftJoin(BooksTable_1.BooksTable, (0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.bookId, BooksTable_1.BooksTable.id))
                        .where((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.ean, id));
                    // Aggregate authors and genres into arrays
                    const result = items.reduce((acc, item) => {
                        if (!acc[item.bookItem.ean]) {
                            acc[item.bookItem.ean] = Object.assign(Object.assign({}, item.bookItem), { book: item.book, language: item.language, location: item.location, authors: [], genres: [] });
                        }
                        if (item.author && !acc[item.bookItem.ean].authors.find((author) => author.id === item.author.id)) {
                            acc[item.bookItem.ean].authors.push(item.author);
                        }
                        if (item.genre && !acc[item.bookItem.ean].genres.find((genre) => genre.id === item.genre.id)) {
                            acc[item.bookItem.ean].genres.push(item.genre);
                        }
                        return acc;
                    }, {});
                    items = Object.values(result);
                    break;
                }
                default: {
                    throw new Error("Invalid type");
                }
            }
            return {
                data: items.length > 0 ? items[0] : null
            };
        });
        this.getMany = (type, query, range) => __awaiter(this, void 0, void 0, function* () {
            let sqlQuery;
            switch (type) {
                case GetMany_1.GetManyType.Authors: {
                    const q = query;
                    // Selecting only the columns from AuthorsTable explicitly
                    sqlQuery = this.db.select({
                        id: AuthorsTable_1.AuthorsTable.id,
                        name: AuthorsTable_1.AuthorsTable.name,
                        surname: AuthorsTable_1.AuthorsTable.surname,
                        birthDate: AuthorsTable_1.AuthorsTable.birthDate
                    })
                        .from(AuthorsTable_1.AuthorsTable)
                        .innerJoin(AuthorsBooksTable_1.AuthorsBooksTable, (0, drizzle_orm_1.eq)(AuthorsTable_1.AuthorsTable.id, AuthorsBooksTable_1.AuthorsBooksTable.authorId)); // Joining authors and authors_books table
                    const conditions = [];
                    // Filter by bookId if provided
                    if (typeof q.bookId === "number") {
                        conditions.push((0, drizzle_orm_1.eq)(AuthorsBooksTable_1.AuthorsBooksTable.bookId, q.bookId)); // Ensuring only authors of the provided bookId are returned
                    }
                    // Filter by phrase if provided (search by name/surname)
                    if (typeof q.phrase === "string") {
                        conditions.push((0, drizzle_orm_1.sql) `to_tsvector('english', ${AuthorsTable_1.AuthorsTable.name} || ' ' || ${AuthorsTable_1.AuthorsTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                    }
                    // Apply conditions if any exist
                    if (conditions.length > 0) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.and)(...conditions));
                    }
                    break;
                }
                case GetMany_1.GetManyType.Reports: {
                    sqlQuery = this.db.select({ id: ReportsTable_1.ReportsTable.id, startDate: ReportsTable_1.ReportsTable.startDate, endDate: ReportsTable_1.ReportsTable.endDate }).from(ReportsTable_1.ReportsTable);
                    break;
                }
                case GetMany_1.GetManyType.Classes: {
                    sqlQuery = this.db.select().from(ClassesTable_1.ClassesTable);
                    break;
                }
                case GetMany_1.GetManyType.Genres: {
                    const q = query;
                    // Selecting only the columns from AuthorsTable explicitly
                    sqlQuery = this.db.select({
                        id: GenresTable_1.GenresTable.id,
                        name: GenresTable_1.GenresTable.name,
                        description: GenresTable_1.GenresTable.description
                    })
                        .from(GenresTable_1.GenresTable)
                        .innerJoin(AuthorsBooksTable_1.AuthorsBooksTable, (0, drizzle_orm_1.eq)(GenresTable_1.GenresTable.id, BooksGenresTable_1.BooksGenresTable.genreId));
                    // Filter by bookId if provided
                    if (typeof q.bookId === "number") {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.eq)(BooksGenresTable_1.BooksGenresTable.bookId, q.bookId));
                    }
                    break;
                }
                case GetMany_1.GetManyType.BookItems: {
                    const q = query;
                    // Base select query with additional isBorrowed field using a subquery
                    sqlQuery = this.db.selectDistinct({
                        ean: BookItemsTable_1.BookItemsTable.ean,
                        ISBN: BookItemsTable_1.BookItemsTable.isbn,
                        remarks: BookItemsTable_1.BookItemsTable.remarks,
                        location_id: BookItemsTable_1.BookItemsTable.locationId,
                        language_id: BookItemsTable_1.BookItemsTable.languageId,
                        book_id: BooksTable_1.BooksTable.id,
                        book_title: BooksTable_1.BooksTable.title,
                        isBorrowed: (0, drizzle_orm_1.sql) `
            EXISTS (
                SELECT 1
                FROM ${BorrowingsTable_1.BorrowingsTable}
                WHERE ${BorrowingsTable_1.BorrowingsTable.bookItemEan} = ${BookItemsTable_1.BookItemsTable.ean}
                  AND ${BorrowingsTable_1.BorrowingsTable.returnDate} IS NULL
            )`.as('isBorrowed')
                    })
                        .from(BookItemsTable_1.BookItemsTable)
                        .innerJoin(BooksTable_1.BooksTable, (0, drizzle_orm_1.eq)(BooksTable_1.BooksTable.id, BookItemsTable_1.BookItemsTable.bookId));
                    const conditions = [];
                    if (typeof q.isBorrowed === "boolean") {
                        const isBorrowedCondition = q.isBorrowed
                            ? (0, drizzle_orm_1.sql) `EXISTS (
                    SELECT 1
                    FROM ${BorrowingsTable_1.BorrowingsTable}
                    WHERE ${BorrowingsTable_1.BorrowingsTable.bookItemEan} = ${BookItemsTable_1.BookItemsTable.ean}
                      AND ${BorrowingsTable_1.BorrowingsTable.returnDate} IS NULL
                )`
                            : (0, drizzle_orm_1.sql) `NOT EXISTS (
                    SELECT 1
                    FROM ${BorrowingsTable_1.BorrowingsTable}
                    WHERE ${BorrowingsTable_1.BorrowingsTable.bookItemEan} = ${BookItemsTable_1.BookItemsTable.ean}
                      AND ${BorrowingsTable_1.BorrowingsTable.returnDate} IS NULL
                )`;
                        conditions.push(isBorrowedCondition);
                    }
                    // Apply search by phrase if provided
                    if (typeof q.phrase == "string") {
                        conditions.push((0, drizzle_orm_1.sql) `${BooksTable_1.BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                    }
                    if (typeof q.bookId == "number") {
                        conditions.push((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.bookId, q.bookId));
                    }
                    // Filter by language ID if provided
                    if (typeof q.languageId == "number") {
                        conditions.push((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.languageId, q.languageId));
                    }
                    if (conditions.length > 0) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.and)(...conditions));
                    }
                    break;
                }
                case GetMany_1.GetManyType.Books: {
                    const q = query;
                    sqlQuery = this.db.select().from(BooksTable_1.BooksTable);
                    if (q.phrase) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.sql) `${BooksTable_1.BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                    }
                    break;
                }
                case GetMany_1.GetManyType.Borrowings: {
                    const q = query;
                    sqlQuery = this.db.select({
                        id: BorrowingsTable_1.BorrowingsTable.id,
                        studentId: BorrowingsTable_1.BorrowingsTable.studentId,
                        bookItemEan: BorrowingsTable_1.BorrowingsTable.bookItemEan,
                        librarianId: BorrowingsTable_1.BorrowingsTable.librarianId,
                        borrowingDate: BorrowingsTable_1.BorrowingsTable.borrowingDate,
                        returnDate: BorrowingsTable_1.BorrowingsTable.returnDate,
                        paidFee: BorrowingsTable_1.BorrowingsTable.paidFee,
                        // Explicitly select non-sensitive fields from LibrariansTable
                        librarian: {
                            id: LibrariansTable_1.LibrariansTable.id,
                            name: LibrariansTable_1.LibrariansTable.name,
                            email: LibrariansTable_1.LibrariansTable.email,
                            surname: LibrariansTable_1.LibrariansTable.surname,
                        }
                    })
                        .from(BorrowingsTable_1.BorrowingsTable)
                        .innerJoin(LibrariansTable_1.LibrariansTable, (0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.librarianId, LibrariansTable_1.LibrariansTable.id))
                        .innerJoin(ClassesTable_1.ClassesTable, (0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.studentId, ClassesTable_1.ClassesTable.id));
                    const conditions = [];
                    if (typeof q.studentId == "number") {
                        conditions.push((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.studentId, q.studentId));
                    }
                    if (typeof q.returned == "boolean") {
                        if (q.returned) {
                            conditions.push((0, drizzle_orm_1.isNotNull)(BorrowingsTable_1.BorrowingsTable.returnDate));
                        }
                        else {
                            conditions.push((0, drizzle_orm_1.isNull)(BorrowingsTable_1.BorrowingsTable.returnDate));
                        }
                    }
                    if (conditions.length > 0) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.and)(...conditions));
                    }
                    break;
                }
                case GetMany_1.GetManyType.Fees: {
                    sqlQuery = this.db.select().from(FeesTable_1.FeesTable);
                    break;
                }
                case GetMany_1.GetManyType.Languages: {
                    const q = query;
                    // Base query selecting distinct languages from LanguagesTable
                    sqlQuery = this.db
                        .select({
                        id: LanguagesTable_1.LanguagesTable.id,
                        code: LanguagesTable_1.LanguagesTable.code,
                        name: LanguagesTable_1.LanguagesTable.name,
                    })
                        .from(LanguagesTable_1.LanguagesTable)
                        // Join with BookItemsTable to filter by bookId
                        .innerJoin(BookItemsTable_1.BookItemsTable, (0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.languageId, LanguagesTable_1.LanguagesTable.id));
                    // Filter by bookId if provided
                    if (typeof q.bookId === "number") {
                        sqlQuery = sqlQuery
                            .where((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.bookId, q.bookId))
                            .distinctOn(LanguagesTable_1.LanguagesTable.id); // Ensuring distinct languages
                    }
                    break;
                }
                case GetMany_1.GetManyType.Librarians: {
                    const q = query;
                    sqlQuery = this.db.select().from(LibrariansTable_1.LibrariansTable);
                    if (q.phrase) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.sql) `to_tsvector('english', ${LibrariansTable_1.LibrariansTable.name} || ' ' || ${LibrariansTable_1.LibrariansTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                    }
                    break;
                }
                case GetMany_1.GetManyType.Locations: {
                    sqlQuery = this.db.select().from(LocationsTable_1.LocationsTable);
                    break;
                }
                case GetMany_1.GetManyType.Reservations: {
                    const q = query;
                    sqlQuery = this.db.select().from(ReservationsTable_1.ReservationsTable);
                    const conditions = [];
                    if (typeof q.studentId === "number") {
                        conditions.push((0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.studentId, q.studentId));
                    }
                    if (typeof q.status === "string") {
                        conditions.push((0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.status, q.status));
                    }
                    if (conditions.length > 0) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.and)(...conditions));
                    }
                    break;
                }
                case GetMany_1.GetManyType.Students: {
                    const q = query;
                    sqlQuery = this.db.select().from(StudentsTable_1.StudentsTable);
                    if (q.phrase) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.sql) `to_tsvector('english', ${StudentsTable_1.StudentsTable.name} || ' ' || ${StudentsTable_1.StudentsTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                    }
                    break;
                }
                default: {
                    throw new Error("Invalid type");
                }
            }
            const totalAmountQuery = this.db.selectDistinct({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(sqlQuery.as('subquery'));
            const totalAmount = (yield totalAmountQuery)[0].count;
            return {
                data: {
                    items: (yield sqlQuery
                        .limit(range[1] - range[0])
                        .offset(range[0])).map((it) => (Object.assign(Object.assign({}, it), { password: undefined }))),
                    totalAmount
                }
            };
        });
        API.getDefaultLibrarian().then(defaultLibrarian => {
            this.getLibrarian({ email: defaultLibrarian.email }).then((existing) => __awaiter(this, void 0, void 0, function* () {
                if (existing == null) {
                    logger.log(LogLevel_1.default.Info, "default librarian not found - creating");
                    yield db.insert(LibrariansTable_1.LibrariansTable).values(defaultLibrarian);
                }
                else {
                    logger.log(LogLevel_1.default.Success, "default librarian found");
                }
                logger.log(LogLevel_1.default.Success, "initialized");
            }));
        });
        API.getDefaultStudent().then(defaultStudent => {
            this.getStudent({ email: defaultStudent.email }).then((existing) => __awaiter(this, void 0, void 0, function* () {
                if (existing == null) {
                    logger.log(LogLevel_1.default.Info, "default student not found - creating");
                    yield db.insert(StudentsTable_1.StudentsTable).values(defaultStudent);
                }
                else {
                    logger.log(LogLevel_1.default.Success, "default student found");
                }
                logger.log(LogLevel_1.default.Success, "initialized");
            }));
        });
    }
}
API.getDefaultLibrarian = () => API.hashPassword("zaq1@WSX").then(hashedPassword => ({
    name: "admin",
    surname: "admin",
    email: "admin@admin.pl",
    password: hashedPassword
}));
API.getDefaultStudent = () => API.hashPassword("zaq1@WSX").then(hashedPassword => ({
    name: "admin",
    surname: "admin",
    email: "admin@admin.pl",
    password: hashedPassword,
    birthDate: new Date(),
    addedDate: new Date(),
    classId: 1
}));
exports.default = API;
