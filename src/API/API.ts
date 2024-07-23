import { SQL, and, desc, eq, isNull, not, or, sql } from "drizzle-orm";
import DB from "../DB/DB";
import { Librarian, LibrariansTable, NewLibrarian } from "../DB/schema/LibrariansTable";
import Logger from "../Logger/Logger";
import bcrypt from "bcrypt"
import LogLevel from "../Logger/LogLevel";
import { Student, StudentsTable } from "../DB/schema/StudentsTable";
import mockupClasses from "../DB/mockup_data/generators/mockupClasses";
import { CreateOneType, CreateQuery } from "./params/CreateOne";
import { DeleteOneType } from "./params/DeleteOne";
import { UpdateOneType, UpdateQuery } from "./params/UpdateOne";
import { GetOneType } from "./params/GetOne";
import { GetManyQuery, GetManyType } from "./params/GetMany";
import { Borrowing, BorrowingsTable } from "../DB/schema/BorrowingsTable";
import { Reservation, ReservationsTable } from "../DB/schema/ReservationsTable";
import { equal } from "assert";
import { BookItem, BookItemsTable } from "../DB/schema/BookItemsTable";
import { AuthorsBooksTable } from "../DB/schema/AuthorsBooksTable";
import { Author, AuthorsTable } from "../DB/schema/AuthorsTable";
import { LocationsTable } from "../DB/schema/LocationsTable";
import { Language, LanguagesTable } from "../DB/schema/LanguagesTable";
import { Genre, GenresTable } from "../DB/schema/GenresTable";
import { Book, BooksTable } from "../DB/schema/BooksTable";
import { Fee, FeesTable } from "../DB/schema/FeesTable";

export type APIResponse<DataType> = {
    data: DataType
    error?: unknown
} | {
    data?: unknown
    error: string
}

//abstracts away DB operations
export default class API {
    private static getDefaultLibrarian = (): Promise<Omit<Librarian, "id">> => API.hashPassword("zaq1@WSX").then(hashedPassword => ({
        name: "admin",
        surname: "admin",
        email: "admin@admin.pl",
        password: hashedPassword
    }))

    private static getDefaultStudent = (): Promise<Omit<Student, "id">> => API.hashPassword("zaq1@WSX").then(hashedPassword => ({
        name: "admin",
        surname: "admin",
        email: "admin@admin.pl",
        password: hashedPassword,
        birthDate: new Date(),
        addedDate: new Date(),
        classId: 1
    }))

    private static takeOneOrNull<T>(values: T[]): T | null {
        if (values.length == 1) {
            return values[0]
        }

        return null
    }

    private static hashPassword(password: string) {
        return bcrypt.hash(password, bcrypt.genSaltSync(10))
    }

    constructor(
        private readonly db: DB,
        private readonly logger: Logger
    ) {
        //create defaults users if do not exist

        API.getDefaultLibrarian().then(defaultLibrarian => {
            this.getLibrarian({ email: defaultLibrarian.email }).then(async existing => {
                if (existing == null) {
                    logger.log(LogLevel.Info, "default librarian not found - creating")
                    await db.insert(LibrariansTable).values(defaultLibrarian)
                } else {
                    logger.log(LogLevel.Success, "default librarian found")
                }

                logger.log(LogLevel.Success, "initialized")
            })
        })

        API.getDefaultStudent().then(defaultStudent => {
            this.getStudent({ email: defaultStudent.email }).then(async existing => {
                if (existing == null) {
                    logger.log(LogLevel.Info, "default student not found - creating")
                    await db.insert(StudentsTable).values(defaultStudent)
                } else {
                    logger.log(LogLevel.Success, "default student found")
                }

                logger.log(LogLevel.Success, "initialized")
            })
        })
    }

    readonly requestReportCreation = async () => { throw "ToDo" }
    readonly downloadReport = async () => { throw "ToDo" }
    readonly getAllGeneratedReports = async () => { throw "ToDo" }
    readonly resetPassword = async () => {
        throw "ToDo"
    }

    readonly getStudent = async ({ email, id, password }: { email?: string, id?: number, password?: string }): Promise<Student | null> => {
        const where: SQL[] = []

        if (email != null) {
            where.push(eq(StudentsTable.email, email))
        }

        if (id != null) {
            where.push(eq(StudentsTable.id, id))
        }

        return this.db.select().from(StudentsTable).where(and(...where))
            .then(API.takeOneOrNull)
            .then(librarian => {
                if (librarian == null) {
                    return null
                }

                if (password != null && !bcrypt.compareSync(password, librarian.password)) {
                    return null
                }

                return librarian
            })
    }

    readonly getLibrarian = async ({ email, id, password }: { email?: string, id?: number, password?: string }): Promise<Librarian | null> => {
        const where: SQL[] = []

        if (email != null) {
            where.push(eq(LibrariansTable.email, email))
        }

        if (id != null) {
            where.push(eq(LibrariansTable.id, id))
        }

        return this.db.select().from(LibrariansTable).where(and(...where))
            .then(API.takeOneOrNull)
            .then(librarian => {
                if (librarian == null) {
                    return null
                }

                if (password != null && !bcrypt.compareSync(password, librarian.password)) {
                    return null
                }

                return librarian
            })
    }

    readonly setPassword = async (librarian: Librarian, newPassword: string): Promise<void> => {
        this.logger.log(LogLevel.Warning, "changing password not implemented")
        throw new Error("ToDo!")
    }

    readonly returnBookItem = async (bookItemId: number, fee: number): Promise<APIResponse<{}>> => {
        //sprawdź czy w ogóle jest do zwrotu
        const borrowingItem = await this.db.select().from(BorrowingsTable).where(and(eq(BorrowingsTable.bookItemEan, bookItemId), isNull(BorrowingsTable.returnDate)))

        if (borrowingItem.length != 1) {
            return {
                error: "Book is already returned"
            }
        }

        await this.db.update(BorrowingsTable).set({ returnDate: new Date(), paidFee: fee }).where(eq(BorrowingsTable.id, bookItemId))

        return {
            data: {}
        }
    }

    readonly reserveBook = async (studentId: number, bookId: number): Promise<APIResponse<{ reservationId: number }>> => {
        const result = await this.db.insert(ReservationsTable).values({ bookId, date: new Date(), studentId }).returning()

        return {
            data: {
                reservationId: result[0].id
            }
        }
    }

    readonly cancelReservation = async (reservationId: number): Promise<APIResponse<{}>> => {
        await this.db.update(ReservationsTable).set({ status: "canceled" })

        return { data: {} }
    }

    readonly lendBook = async (librarianId: number, studentId: number, bookItemId: number): Promise<APIResponse<{ borrowingId: number }>> => {
        //sprawdź czy możesz (czy się )
        //dodaj nowe wypożyczenie
        //usuń rezerwację jeśli jest

        //checking if available
        const result = this.db.select().from(BorrowingsTable).where(and(eq(BorrowingsTable.bookItemEan, bookItemId), not(isNull(BorrowingsTable.returnDate))))
        if (result != null) {
            return {
                error: "Book is already returned"
            }
        }

        const bookId = (await this.db.select({ bookId: BookItemsTable.bookId }).from(BookItemsTable).where(eq(BookItemsTable.ean, bookItemId)))[0].bookId

        const reservation = await this.db.select().from(ReservationsTable).where(and(eq(ReservationsTable.bookId, bookId), eq(ReservationsTable.studentId, studentId), eq(ReservationsTable.status, "active")))
        if (reservation.length == 1) {
            await this.db.update(ReservationsTable).set({ status: "realized" }).where(eq(ReservationsTable.id, reservation[0].id))
        }

        const borrowing = await this.db.insert(BorrowingsTable).values({
            studentId,
            bookItemEan: bookItemId,
            librarianId,
            borrowingDate: new Date(),
        }).returning()

        return {
            data: {
                borrowingId: borrowing[0].id
            }
        }
    }
    
    readonly createOne = async <T extends CreateOneType>(type: T, obj: CreateQuery<T>): Promise<APIResponse<{ createdId: number }>> => {
        switch (type) {
            case CreateOneType.Author: {
                return this.db.insert(AuthorsTable).values(obj as CreateQuery<CreateOneType.Author>).returning().then(it => ({
                    data: {
                        createdId: it[0].id
                    }
                }))
            }
            case CreateOneType.Book: {
                return this.db.insert(BooksTable).values(obj as CreateQuery<CreateOneType.Book>).returning().then(it => ({
                    data: {
                        createdId: it[0].id
                    }
                }))
            }
            case CreateOneType.BookItem: {
                return this.db.insert(BookItemsTable).values(obj as CreateQuery<CreateOneType.BookItem>).returning().then(it => ({
                    data: {
                        createdId: it[0].ean
                    }
                }))
            }
            case CreateOneType.Genre: {
                return this.db.insert(GenresTable).values(obj as CreateQuery<CreateOneType.Genre>).returning().then(it => ({
                    data: {
                        createdId: it[0].id
                    }
                }))
            }
            case CreateOneType.Language: {
                return this.db.insert(LanguagesTable).values(obj as CreateQuery<CreateOneType.Language>).returning().then(it => ({
                    data: {
                        createdId: it[0].id
                    }
                }))
            }
            case CreateOneType.Librarian: {
                return this.db.insert(LibrariansTable).values(obj as CreateQuery<CreateOneType.Librarian>).returning().then(it => ({
                    data: {
                        createdId: it[0].id
                    }
                }))
            }
            case CreateOneType.Location: {
                return this.db.insert(LocationsTable).values(obj as CreateQuery<CreateOneType.Location>).returning().then(it => ({
                    data: {
                        createdId: it[0].id
                    }
                }))
            }
            default: {
                throw new Error("Invalid type");
            }
        }
    }

    readonly deleteOne = async <T extends DeleteOneType>(type: T, id: number): Promise<APIResponse<{}>> => {
        switch (type) {
            case DeleteOneType.Author: {
                await this.db.delete(AuthorsTable).where(eq(AuthorsTable.id, id))
                break;
            }
            case DeleteOneType.Book: {
                await this.db.delete(BooksTable).where(eq(BooksTable.id, id))
                break;
            }
            case DeleteOneType.BookItem: {
                await this.db.delete(BookItemsTable).where(eq(BookItemsTable.ean, id))
                break;
            }
            case DeleteOneType.Genre: {
                await this.db.delete(GenresTable).where(eq(GenresTable.id, id))
                break;
            }
            case DeleteOneType.Language: {
                await this.db.delete(LanguagesTable).where(eq(LanguagesTable.id, id))
                break;
            }
            case DeleteOneType.Fees: {
                await this.db.delete(FeesTable).where(eq(FeesTable.fee, id))
                break;
            }
            case DeleteOneType.Location: {
                await this.db.delete(LocationsTable).where(eq(LocationsTable.id, id))
                break;
            }
            default: {
                throw new Error("Invalid type");
            }
        }

        return {
            data: {}
        }
    }
    readonly updateOne = async <T extends UpdateOneType>(type: T, id: number, obj: UpdateQuery<T>): Promise<APIResponse<{}>> => {
        switch (type) {
            case UpdateOneType.Author: {
                await this.db.update(AuthorsTable).set(obj).where(eq(AuthorsTable.id, id))
                break;
            }
            case UpdateOneType.Book: {
                await this.db.update(BooksTable).set(obj).where(eq(BooksTable.id, id))
                break;
            }
            case UpdateOneType.BookItem: {
                await this.db.update(BookItemsTable).set(obj).where(eq(BookItemsTable.ean, id))
                break;
            }
            case UpdateOneType.Fees: {
                await this.db.update(FeesTable).set(obj).where(eq(FeesTable.fee, id))
                break;
            }
            case UpdateOneType.Genre: {
                await this.db.update(GenresTable).set(obj).where(eq(GenresTable.id, id))
                break;
            }
            case UpdateOneType.Language: {
                await this.db.update(LanguagesTable).set(obj).where(eq(LanguagesTable.id, id))
                break;
            }
            case UpdateOneType.Location: {
                await this.db.update(LocationsTable).set(obj).where(eq(LocationsTable.id, id))
                break;
            }
            default: {
                throw new Error("Invalid type");
            }
        }

        return {
            data: {}
        }
    }
    readonly getOne = async <T extends GetOneType>(type: T, id: number): Promise<APIResponse<(
        T extends GetOneType.Author ? Author :
        T extends GetOneType.Genre ? Genre :
        T extends GetOneType.Librarian ? Librarian :
        T extends GetOneType.Student ? Student :
        never
    )>> => {
        let items: any[]

        switch (type) {
            case GetOneType.Author: {
                items = await this.db.select().from(AuthorsTable).where(eq(AuthorsTable.id, id))
                break;
            }
            case GetOneType.Genre: {
                items = await this.db.select().from(GenresTable).where(eq(GenresTable.id, id))
                break;
            }
            case GetOneType.Librarian: {
                items = await this.db.select().from(LibrariansTable).where(eq(LibrariansTable.id, id))
                break;
            }
            case GetOneType.Student: {
                items = await this.db.select().from(StudentsTable).where(eq(StudentsTable.id, id))
                break;
            }
            default: {
                throw new Error("Invalid type");
            }
        }

        return {
            data: items.length > 0 ? items[0] : null
        }
    }

    readonly getMany = async <T extends GetManyType>(type: T, query: GetManyQuery<T>, range: [number, number]): Promise<APIResponse<(
        T extends GetManyType.Authors ? Author :
        T extends GetManyType.BookItems ? BookItem :
        T extends GetManyType.Books ? Book :
        T extends GetManyType.Borrowings ? Borrowing :
        T extends GetManyType.Fees ? Fee :
        T extends GetManyType.Languages ? Language :
        T extends GetManyType.Librarians ? Librarian :
        T extends GetManyType.Locations ? Location :
        T extends GetManyType.Reservations ? Reservation :
        T extends GetManyType.Students ? Student :
        never
    )[]>> => {
        let sqlQuery: any;
        let countQuery: any;

        switch (type) {
            case GetManyType.Authors: {
                const q = query as GetManyQuery<GetManyType.Authors>;
                sqlQuery = this.db.select().from(AuthorsTable);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(AuthorsTable);

                if (q.phrase) {
                    sqlQuery = sqlQuery.where(
                        sql`to_tsvector('english', ${AuthorsTable.name} || ' ' || ${AuthorsTable.surname}) @@ to_tsquery('english', ${q.phrase})`
                    );
                    countQuery = countQuery.where(
                        sql`to_tsvector('english', ${AuthorsTable.name} || ' ' || ${AuthorsTable.surname}) @@ to_tsquery('english', ${q.phrase})`
                    );
                }
                break;
            }
            case GetManyType.BookItems: {
                const q = query as GetManyQuery<GetManyType.BookItems>;
                sqlQuery = this.db.select({
                    ean: BookItemsTable.ean,
                    ISBN: BookItemsTable.isbn,
                    remarks: BookItemsTable.remarks,
                    location_id: BookItemsTable.locationId,
                    language_id: BookItemsTable.languageId,
                    book_id: BooksTable.id,
                    book_title: BooksTable.title,
                })
                    .from(BookItemsTable)
                    .innerJoin(BooksTable, eq(BooksTable.id, BookItemsTable.bookId));
                countQuery = this.db.select({ count: sql`COUNT(*)` })
                    .from(BookItemsTable)
                    .innerJoin(BooksTable, eq(BooksTable.id, BookItemsTable.bookId));

                if (q.phrase) {
                    sqlQuery = sqlQuery.where(sql`${BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                    countQuery = countQuery.where(sql`${BooksTable.title} ILIKE ${`%${q.phrase}%`}`);

                }

                if (q.languageId) {
                    sqlQuery = sqlQuery.where(eq(BookItemsTable.languageId, q.languageId));
                    countQuery = countQuery.where(eq(BookItemsTable.languageId, q.languageId));
                }
                break;
            }
            case GetManyType.Books: {
                const q = query as GetManyQuery<GetManyType.Books>;
                sqlQuery = this.db.select().from(BooksTable);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(BooksTable);

                if (q.phrase) {
                    sqlQuery = sqlQuery.where(sql`${BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                    countQuery = countQuery.where(sql`${BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                }
                break;
            }
            case GetManyType.Borrowings: {
                sqlQuery = this.db.select().from(BorrowingsTable)
                    .limit(range[1] - range[0])
                    .offset(range[0]);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(BorrowingsTable);
                break;
            }
            case GetManyType.Fees: {
                sqlQuery = this.db.select().from(FeesTable)
                    .limit(range[1] - range[0])
                    .offset(range[0]);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(FeesTable);
                break;
            }
            case GetManyType.Languages: {
                sqlQuery = this.db.select().from(LanguagesTable)
                    .limit(range[1] - range[0])
                    .offset(range[0]);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(LanguagesTable);
                break;
            }
            case GetManyType.Librarians: {
                const q = query as GetManyQuery<GetManyType.Librarians>;
                sqlQuery = this.db.select().from(LibrariansTable);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(LibrariansTable);

                if (q.phrase) {
                    sqlQuery = sqlQuery.where(
                        sql`to_tsvector('english', ${LibrariansTable.name} || ' ' || ${LibrariansTable.surname}) @@ to_tsquery('english', ${q.phrase})`
                    );
                    countQuery = countQuery.where(
                        sql`to_tsvector('english', ${LibrariansTable.name} || ' ' || ${LibrariansTable.surname}) @@ to_tsquery('english', ${q.phrase})`
                    );
                }
                break;
            }
            case GetManyType.Locations: {
                sqlQuery = this.db.select().from(LocationsTable)
                    .limit(range[1] - range[0])
                    .offset(range[0]);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(LocationsTable);
                break;
            }
            case GetManyType.Reservations: {
                const q = query as GetManyQuery<GetManyType.Reservations>;
                sqlQuery = this.db.select().from(ReservationsTable);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(ReservationsTable);

                if (q.status) {
                    sqlQuery = sqlQuery.where(eq(ReservationsTable.status, q.status));
                    countQuery = countQuery.where(eq(ReservationsTable.status, q.status));
                }
                break;
            }
            case GetManyType.Students: {
                const q = query as GetManyQuery<GetManyType.Students>;
                sqlQuery = this.db.select().from(StudentsTable);
                countQuery = this.db.select({ count: sql`COUNT(*)` }).from(StudentsTable);

                if (q.phrase) {
                    sqlQuery = sqlQuery.where(
                        sql`to_tsvector('english', ${StudentsTable.name} || ' ' || ${StudentsTable.surname}) @@ to_tsquery('english', ${q.phrase})`
                    );
                    countQuery = countQuery.where(
                        sql`to_tsvector('english', ${StudentsTable.name} || ' ' || ${StudentsTable.surname}) @@ to_tsquery('english', ${q.phrase})`
                    );
                }
                break;
            }
            default: {
                throw new Error("Invalid type");
            }
        }

        return {
            data: (await sqlQuery).map((it: any) => ({ ...it, password: undefined }))
        }
    }
}