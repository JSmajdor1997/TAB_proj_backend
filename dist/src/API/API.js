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
const drizzle_orm_1 = require("drizzle-orm");
const LibrariansTable_1 = require("../DB/schema/LibrariansTable");
const bcrypt_1 = __importDefault(require("bcrypt"));
const LogLevel_1 = __importDefault(require("../Logger/LogLevel"));
const StudentsTable_1 = require("../DB/schema/StudentsTable");
const CreateOne_1 = require("./params/CreateOne");
const DeleteOne_1 = require("./params/DeleteOne");
const UpdateOne_1 = require("./params/UpdateOne");
const GetOne_1 = require("./params/GetOne");
const GetMany_1 = require("./params/GetMany");
const BorrowingsTable_1 = require("../DB/schema/BorrowingsTable");
const ReservationsTable_1 = require("../DB/schema/ReservationsTable");
const BookItemsTable_1 = require("../DB/schema/BookItemsTable");
const AuthorsTable_1 = require("../DB/schema/AuthorsTable");
const LocationsTable_1 = require("../DB/schema/LocationsTable");
const LanguagesTable_1 = require("../DB/schema/LanguagesTable");
const GenresTable_1 = require("../DB/schema/GenresTable");
const BooksTable_1 = require("../DB/schema/BooksTable");
const FeesTable_1 = require("../DB/schema/FeesTable");
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
            yield this.db.update(BorrowingsTable_1.BorrowingsTable).set({ returnDate: new Date(), paidFee: fee }).where((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.id, bookItemId));
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
            yield this.db.update(ReservationsTable_1.ReservationsTable).set({ status: "canceled" });
            return { data: {} };
        });
        this.lendBook = (librarianId, studentId, bookItemId) => __awaiter(this, void 0, void 0, function* () {
            //sprawdź czy możesz (czy się )
            //dodaj nowe wypożyczenie
            //usuń rezerwację jeśli jest
            //checking if available
            const result = this.db.select().from(BorrowingsTable_1.BorrowingsTable).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.bookItemEan, bookItemId), (0, drizzle_orm_1.not)((0, drizzle_orm_1.isNull)(BorrowingsTable_1.BorrowingsTable.returnDate))));
            if (result != null) {
                return {
                    error: "Book is already returned"
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
            let countQuery;
            switch (type) {
                case GetMany_1.GetManyType.Authors: {
                    const q = query;
                    sqlQuery = this.db.select().from(AuthorsTable_1.AuthorsTable);
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(AuthorsTable_1.AuthorsTable);
                    if (q.phrase) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.sql) `to_tsvector('english', ${AuthorsTable_1.AuthorsTable.name} || ' ' || ${AuthorsTable_1.AuthorsTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                        countQuery = countQuery.where((0, drizzle_orm_1.sql) `to_tsvector('english', ${AuthorsTable_1.AuthorsTable.name} || ' ' || ${AuthorsTable_1.AuthorsTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                    }
                    break;
                }
                case GetMany_1.GetManyType.BookItems: {
                    const q = query;
                    // Base select query with additional isBorrowed field
                    sqlQuery = this.db.selectDistinct({
                        ean: BookItemsTable_1.BookItemsTable.ean,
                        ISBN: BookItemsTable_1.BookItemsTable.isbn,
                        remarks: BookItemsTable_1.BookItemsTable.remarks,
                        location_id: BookItemsTable_1.BookItemsTable.locationId,
                        language_id: BookItemsTable_1.BookItemsTable.languageId,
                        book_id: BooksTable_1.BooksTable.id,
                        book_title: BooksTable_1.BooksTable.title,
                        isBorrowed: (0, drizzle_orm_1.sql) `CASE WHEN ${BorrowingsTable_1.BorrowingsTable.id} IS NOT NULL AND ${BorrowingsTable_1.BorrowingsTable.returnDate} IS NULL THEN TRUE ELSE FALSE END`.as('isBorrowed')
                    })
                        .from(BookItemsTable_1.BookItemsTable)
                        .innerJoin(BooksTable_1.BooksTable, (0, drizzle_orm_1.eq)(BooksTable_1.BooksTable.id, BookItemsTable_1.BookItemsTable.bookId))
                        .leftJoin(BorrowingsTable_1.BorrowingsTable, (0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.ean, BorrowingsTable_1.BorrowingsTable.bookItemEan));
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
                        .from(BookItemsTable_1.BookItemsTable)
                        .innerJoin(BooksTable_1.BooksTable, (0, drizzle_orm_1.eq)(BooksTable_1.BooksTable.id, BookItemsTable_1.BookItemsTable.bookId));
                    // Apply the isBorrowed filter if it's defined
                    if (q.isBorrowed !== undefined) {
                        const isBorrowedCondition = q.isBorrowed
                            ? (0, drizzle_orm_1.sql) `${BorrowingsTable_1.BorrowingsTable.id} IS NOT NULL AND ${BorrowingsTable_1.BorrowingsTable.returnDate} IS NULL`
                            : (0, drizzle_orm_1.sql) `${BorrowingsTable_1.BorrowingsTable.id} IS NULL OR ${BorrowingsTable_1.BorrowingsTable.returnDate} IS NOT NULL`;
                        sqlQuery = sqlQuery.where(isBorrowedCondition);
                        countQuery = countQuery.where(isBorrowedCondition);
                    }
                    // Apply search by phrase if provided
                    if (q.phrase) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.sql) `${BooksTable_1.BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                        countQuery = countQuery.where((0, drizzle_orm_1.sql) `${BooksTable_1.BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                    }
                    // Filter by language ID if provided
                    if (q.languageId) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.languageId, q.languageId));
                        countQuery = countQuery.where((0, drizzle_orm_1.eq)(BookItemsTable_1.BookItemsTable.languageId, q.languageId));
                    }
                    break;
                }
                case GetMany_1.GetManyType.Books: {
                    const q = query;
                    sqlQuery = this.db.select().from(BooksTable_1.BooksTable).limit(range[1] - range[0])
                        .offset(range[0]);
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(BooksTable_1.BooksTable);
                    if (q.phrase) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.sql) `${BooksTable_1.BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                        countQuery = countQuery.where((0, drizzle_orm_1.sql) `${BooksTable_1.BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                    }
                    break;
                }
                case GetMany_1.GetManyType.Borrowings: {
                    const q = query;
                    // Base select query with optional studentId filter
                    sqlQuery = this.db.select()
                        .from(BorrowingsTable_1.BorrowingsTable)
                        .limit(range[1] - range[0])
                        .offset(range[0]);
                    // Apply the studentId filter if provided
                    if (q.studentId != undefined) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.studentId, q.studentId));
                    }
                    // Count query with optional studentId filter
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
                        .from(BorrowingsTable_1.BorrowingsTable);
                    // Apply the studentId filter if provided
                    if (q.studentId != undefined) {
                        countQuery = countQuery.where((0, drizzle_orm_1.eq)(BorrowingsTable_1.BorrowingsTable.studentId, q.studentId));
                    }
                    break;
                }
                case GetMany_1.GetManyType.Fees: {
                    sqlQuery = this.db.select().from(FeesTable_1.FeesTable)
                        .limit(range[1] - range[0])
                        .offset(range[0]);
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(FeesTable_1.FeesTable);
                    break;
                }
                case GetMany_1.GetManyType.Languages: {
                    sqlQuery = this.db.select().from(LanguagesTable_1.LanguagesTable)
                        .limit(range[1] - range[0])
                        .offset(range[0]);
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(LanguagesTable_1.LanguagesTable);
                    break;
                }
                case GetMany_1.GetManyType.Librarians: {
                    const q = query;
                    sqlQuery = this.db.select().from(LibrariansTable_1.LibrariansTable).limit(range[1] - range[0])
                        .offset(range[0]);
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(LibrariansTable_1.LibrariansTable);
                    if (q.phrase) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.sql) `to_tsvector('english', ${LibrariansTable_1.LibrariansTable.name} || ' ' || ${LibrariansTable_1.LibrariansTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                        countQuery = countQuery.where((0, drizzle_orm_1.sql) `to_tsvector('english', ${LibrariansTable_1.LibrariansTable.name} || ' ' || ${LibrariansTable_1.LibrariansTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                    }
                    break;
                }
                case GetMany_1.GetManyType.Locations: {
                    sqlQuery = this.db.select().from(LocationsTable_1.LocationsTable)
                        .limit(range[1] - range[0])
                        .offset(range[0]);
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(LocationsTable_1.LocationsTable);
                    break;
                }
                case GetMany_1.GetManyType.Reservations: {
                    const q = query;
                    sqlQuery = this.db.select().from(ReservationsTable_1.ReservationsTable);
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(ReservationsTable_1.ReservationsTable);
                    if (q.status) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.status, q.status));
                        countQuery = countQuery.where((0, drizzle_orm_1.eq)(ReservationsTable_1.ReservationsTable.status, q.status));
                    }
                    break;
                }
                case GetMany_1.GetManyType.Students: {
                    const q = query;
                    sqlQuery = this.db.select().from(StudentsTable_1.StudentsTable).limit(range[1] - range[0])
                        .offset(range[0]);
                    countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` }).from(StudentsTable_1.StudentsTable);
                    if (q.phrase) {
                        sqlQuery = sqlQuery.where((0, drizzle_orm_1.sql) `to_tsvector('english', ${StudentsTable_1.StudentsTable.name} || ' ' || ${StudentsTable_1.StudentsTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                        countQuery = countQuery.where((0, drizzle_orm_1.sql) `to_tsvector('english', ${StudentsTable_1.StudentsTable.name} || ' ' || ${StudentsTable_1.StudentsTable.surname}) @@ to_tsquery('english', ${q.phrase})`);
                    }
                    break;
                }
                default: {
                    throw new Error("Invalid type");
                }
            }
            return {
                data: {
                    items: (yield sqlQuery).map((it) => (Object.assign(Object.assign({}, it), { password: undefined }))),
                    totalAmount: yield countQuery
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
