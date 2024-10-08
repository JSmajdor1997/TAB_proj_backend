import bcrypt from "bcrypt";
import { SQL, and, between, eq, isNotNull, isNull, not, sql } from "drizzle-orm";
import { AuthorsBooksTable } from "../DB/schema/AuthorsBooksTable";
import { Author, AuthorsTable } from "../DB/schema/AuthorsTable";
import { BookItem, BookItemsTable } from "../DB/schema/BookItemsTable";
import { BooksGenresTable } from "../DB/schema/BooksGenresTable";
import { Book, BooksTable } from "../DB/schema/BooksTable";
import { Borrowing, BorrowingsTable } from "../DB/schema/BorrowingsTable";
import { Fee, FeesTable } from "../DB/schema/FeesTable";
import { Genre, GenresTable } from "../DB/schema/GenresTable";
import { Language, LanguagesTable } from "../DB/schema/LanguagesTable";
import { Librarian, LibrariansTable } from "../DB/schema/LibrariansTable";
import { LocationsTable } from "../DB/schema/LocationsTable";
import { ReportsTable } from "../DB/schema/ReportsTable";
import { Reservation, ReservationsTable } from "../DB/schema/ReservationsTable";
import { Student, StudentsTable } from "../DB/schema/StudentsTable";
import Logger from "../Logger/Logger";
import LogLevel from "../Logger/LogLevel";
import { CreateOneType, CreateQuery } from "./params/CreateOne";
import { DeleteOneType } from "./params/DeleteOne";
import { GetManyQuery, GetManyType } from "./params/GetMany";
import { GetOneType } from "./params/GetOne";
import { UpdateOneType, UpdateQuery } from "./params/UpdateOne";
import { Class, ClassesTable } from "../DB/schema/ClassesTable";
import DB from "../DB/DB";

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

    private static getDefaultStudent = (): Promise<Omit<Student, "id" | "classId">> => API.hashPassword("zaq1@WSX").then(hashedPassword => ({
        name: "admin",
        surname: "admin",
        email: "admin@admin.pl",
        password: hashedPassword,
        birthDate: new Date(),
        addedDate: new Date(),
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

    private async initializeWithDefaultObjects() {
        const defaultLibrarian = await API.getDefaultLibrarian()
        const existingDefaultLibrarian = await this.getLibrarian({ email: defaultLibrarian.email })
        if (existingDefaultLibrarian == null) {
            this.logger.log(LogLevel.Info, "default librarian not found - creating")

            await this.db.insert(LibrariansTable).values(defaultLibrarian)
            this.logger.log(LogLevel.Success, "initialized")
        } else {
            this.logger.log(LogLevel.Success, "default librarian found")
        }

        const defaultStudent = await API.getDefaultStudent()
        const existingDefaultStudent = await this.getStudent({ email: defaultStudent.email })
        if (existingDefaultStudent == null) {
            this.logger.log(LogLevel.Info, "default student not found - creating")

            let c: Class

            const allClasses = await this.getMany(GetManyType.Classes, {}, [0, 5]) as { data: Array<Class> }
            if (allClasses.data.length > 0) {
                c = allClasses.data[0]
            } else {
                const insertedClass = await this.db.insert(ClassesTable).values({
                    name: "Klasa pokazowa",
                    startingDate: new Date()
                }).returning()

                c = insertedClass[0]
            }

            await this.db.insert(StudentsTable).values({
                ...defaultStudent,
                classId: c.id
            })
        } else {
            this.logger.log(LogLevel.Success, "default student found")
        }

        this.logger.log(LogLevel.Success, "initialized")
    }

    constructor(
        private readonly db: DB,
        private readonly logger: Logger
    ) {
        this.initializeWithDefaultObjects()
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

    readonly returnBookItem = async (bookItemId: number, fee: number): Promise<APIResponse<{}>> => {
        //sprawdź czy w ogóle jest do zwrotu
        const borrowingItem = await this.db.select().from(BorrowingsTable).where(and(eq(BorrowingsTable.bookItemEan, bookItemId), isNull(BorrowingsTable.returnDate)))

        if (borrowingItem.length != 1) {
            return {
                error: "Book is already returned"
            }
        }

        await this.db.update(BorrowingsTable).set({ returnDate: new Date(), paidFee: fee }).where(eq(BorrowingsTable.id, borrowingItem[0].id))

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
        await this.db.update(ReservationsTable).set({ status: "canceled" }).where(eq(ReservationsTable.id, reservationId))

        return { data: {} }
    }

    readonly lendBook = async (librarianId: number, studentId: number, bookItemId: number): Promise<APIResponse<{ borrowingId: number }>> => {
        //sprawdź czy możesz (czy się )
        //dodaj nowe wypożyczenie
        //usuń rezerwację jeśli jest

        //checking if available
        const result = this.db.select().from(BorrowingsTable).where(and(eq(BorrowingsTable.bookItemEan, bookItemId), not(isNull(BorrowingsTable.returnDate))))
        if (result == null) {
            return {
                error: "Book is already lent"
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
            case CreateOneType.Report: {
                return this.db.insert(ReportsTable).values(obj as CreateQuery<CreateOneType.Report>).returning().then(it => ({
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
            case CreateOneType.Student: {
                const rawUser = obj as CreateQuery<CreateOneType.Student>
                return API.hashPassword(rawUser.password).then(hashedPassword => this.db.insert(StudentsTable).values({ ...obj, password: hashedPassword, email: rawUser.email.toLocaleLowerCase() } as CreateQuery<CreateOneType.Student>).returning().then(it => ({
                    data: {
                        createdId: it[0].id
                    }
                })))
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
            case DeleteOneType.Student: {
                await this.db.delete(StudentsTable).where(eq(LocationsTable.id, id))
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
            case UpdateOneType.Student: {
                await this.db.update(StudentsTable).set(obj).where(eq(StudentsTable.id, id))
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
        T extends GetOneType.BookItem ? Student :
        T extends GetOneType.Book ? Book :
        T extends GetOneType.Reservation ? Reservation :
        T extends GetOneType.Borrowing ? Borrowing :
        T extends GetOneType.Report ? Report :
        T extends GetOneType.Class ? Class :
        never
    )>> => {
        let items: any[]

        switch (type) {
            case GetOneType.Author: {
                items = await this.db.select().from(AuthorsTable).where(eq(AuthorsTable.id, id))
                break;
            }
            case GetOneType.Class: {
                items = await this.db.select().from(ClassesTable).where(eq(ClassesTable.id, id))
                break;
            }
            case GetOneType.Report: {
                items = await this.db.select().from(ReportsTable).where(eq(ReportsTable.id, id));
                break;
            }
            case GetOneType.Borrowing: {
                items = await this.db.select().from(BorrowingsTable).where(eq(BorrowingsTable.id, id))
                break;
            }
            case GetOneType.Reservation: {
                items = await this.db.select().from(ReservationsTable).where(eq(ReservationsTable.id, id))
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
            case GetOneType.Book: {
                items = await this.db.select().from(BooksTable).where(eq(BooksTable.id, id))
                break;
            }
            case GetOneType.BookItem: {
                items = await this.db.select({
                    bookItem: BookItemsTable,
                    language: LanguagesTable,
                    location: LocationsTable,
                    author: AuthorsTable,
                    genre: GenresTable,
                    book: BooksTable
                })
                    .from(BookItemsTable)
                    .leftJoin(LanguagesTable, eq(BookItemsTable.languageId, LanguagesTable.id))
                    .leftJoin(LocationsTable, eq(BookItemsTable.locationId, LocationsTable.id))
                    .leftJoin(AuthorsBooksTable, eq(BookItemsTable.bookId, AuthorsBooksTable.bookId))
                    .leftJoin(AuthorsTable, eq(AuthorsBooksTable.authorId, AuthorsTable.id))
                    .leftJoin(BooksGenresTable, eq(BookItemsTable.bookId, BooksGenresTable.bookId))
                    .leftJoin(GenresTable, eq(BooksGenresTable.genreId, GenresTable.id))
                    .leftJoin(BooksTable, eq(BookItemsTable.bookId, BooksTable.id))
                    .where(eq(BookItemsTable.ean, id));

                // Aggregate authors and genres into arrays
                const result = items.reduce((acc, item) => {
                    if (!acc[item.bookItem.ean]) {
                        acc[item.bookItem.ean] = {
                            ...item.bookItem,
                            book: item.book,
                            language: item.language,
                            location: item.location,
                            authors: [],
                            genres: [],
                        };
                    }

                    if (item.author && !acc[item.bookItem.ean].authors.find((author: any) => author.id === item.author.id)) {
                        acc[item.bookItem.ean].authors.push(item.author);
                    }

                    if (item.genre && !acc[item.bookItem.ean].genres.find((genre: any) => genre.id === item.genre.id)) {
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
        }
    }

    readonly getMany = async <T extends GetManyType>(type: T, query: GetManyQuery<T>, range: [number, number]): Promise<APIResponse<{
        items: (
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
            T extends GetManyType.Reports ? Report :
            T extends GetManyType.Genres ? Genre :
            T extends GetManyType.Classes ? Class :
            never
        )[],
        totalAmount: number
    }>> => {
        let sqlQuery: any;

        switch (type) {
            case GetManyType.Authors: {
                const q = query as GetManyQuery<GetManyType.Authors>;

                // Selecting only the columns from AuthorsTable explicitly
                sqlQuery = this.db.select({
                    id: AuthorsTable.id,
                    name: AuthorsTable.name,
                    surname: AuthorsTable.surname,
                    birthDate: AuthorsTable.birthDate
                })
                    .from(AuthorsTable)
                    .innerJoin(AuthorsBooksTable, eq(AuthorsTable.id, AuthorsBooksTable.authorId));  // Joining authors and authors_books table

                const conditions = [];

                // Filter by bookId if provided
                if (typeof q.bookId === "number") {
                    conditions.push(eq(AuthorsBooksTable.bookId, q.bookId));  // Ensuring only authors of the provided bookId are returned
                }

                // Filter by phrase if provided (search by name/surname)
                if (typeof q.phrase === "string") {
                    conditions.push(sql`
                        (${AuthorsTable.name} || ' ' || ${AuthorsTable.surname}) ILIKE ${q.phrase.toLocaleLowerCase()}
                    `);
                }

                // Apply conditions if any exist
                if (conditions.length > 0) {
                    sqlQuery = sqlQuery.where(and(...conditions));
                }

                break;
            }
            case GetManyType.Reports: {
                sqlQuery = this.db.select({ id: ReportsTable.id, startDate: ReportsTable.startDate, endDate: ReportsTable.endDate }).from(ReportsTable);

                break;
            }
            case GetManyType.Classes: {
                sqlQuery = this.db.select().from(ClassesTable);

                break;
            }
            case GetManyType.Genres: {
                const q = query as GetManyQuery<GetManyType.Authors>;

                // Selecting only the columns from AuthorsTable explicitly
                sqlQuery = this.db.select({
                    id: GenresTable.id,
                    name: GenresTable.name,
                    description: GenresTable.description
                })
                    .from(GenresTable)
                    .innerJoin(BooksGenresTable, eq(GenresTable.id, BooksGenresTable.genreId));

                // Filter by bookId if provided
                if (typeof q.bookId === "number") {
                    sqlQuery = sqlQuery.where(eq(BooksGenresTable.bookId, q.bookId))
                }

                break;
            }
            case GetManyType.BookItems: {
                const q = query as GetManyQuery<GetManyType.BookItems>;

                // Base select query with additional isBorrowed field using a subquery
                sqlQuery = this.db.selectDistinct({
                    ean: BookItemsTable.ean,
                    ISBN: BookItemsTable.isbn,
                    remarks: BookItemsTable.remarks,
                    location_id: BookItemsTable.locationId,
                    language_id: BookItemsTable.languageId,
                    book_id: BooksTable.id,
                    book_title: BooksTable.title,
                    isBorrowed: sql`
            EXISTS (
                SELECT 1
                FROM ${BorrowingsTable}
                WHERE ${BorrowingsTable.bookItemEan} = ${BookItemsTable.ean}
                  AND ${BorrowingsTable.returnDate} IS NULL
            )`.as('isBorrowed')
                })
                    .from(BookItemsTable)
                    .innerJoin(BooksTable, eq(BooksTable.id, BookItemsTable.bookId));

                const conditions = []

                if (typeof q.isBorrowed === "boolean") {
                    const isBorrowedCondition = q.isBorrowed
                        ? sql`EXISTS (
                    SELECT 1
                    FROM ${BorrowingsTable}
                    WHERE ${BorrowingsTable.bookItemEan} = ${BookItemsTable.ean}
                      AND ${BorrowingsTable.returnDate} IS NULL
                )`
                        : sql`NOT EXISTS (
                    SELECT 1
                    FROM ${BorrowingsTable}
                    WHERE ${BorrowingsTable.bookItemEan} = ${BookItemsTable.ean}
                      AND ${BorrowingsTable.returnDate} IS NULL
                )`;
                    conditions.push(isBorrowedCondition);
                }

                // Apply search by phrase if provided
                if (typeof q.phrase == "string") {
                    conditions.push(sql`${BooksTable.title} ILIKE ${`%${q.phrase}%`}`)
                }

                if (typeof q.bookId == "number") {
                    conditions.push(eq(BookItemsTable.bookId, q.bookId))
                }

                // Filter by language ID if provided
                if (typeof q.languageId == "number") {
                    conditions.push(eq(BookItemsTable.languageId, q.languageId))
                }

                if (conditions.length > 0) {
                    sqlQuery = sqlQuery.where(and(...conditions));
                }

                break;
            }
            case GetManyType.Books: {
                const q = query as GetManyQuery<GetManyType.Books>;
                sqlQuery = this.db.select().from(BooksTable)

                if (q.phrase) {
                    sqlQuery = sqlQuery.where(sql`${BooksTable.title} ILIKE ${`%${q.phrase}%`}`);
                }
                break;
            }
            case GetManyType.Borrowings: {
                const q = query as GetManyQuery<GetManyType.Borrowings>;

                sqlQuery = this.db.select({
                    id: BorrowingsTable.id,
                    studentId: BorrowingsTable.studentId,
                    bookItemEan: BorrowingsTable.bookItemEan,
                    librarianId: BorrowingsTable.librarianId,
                    borrowingDate: BorrowingsTable.borrowingDate,
                    returnDate: BorrowingsTable.returnDate,
                    class: {
                        name: ClassesTable.name,
                        id: ClassesTable.id,
                    },
                    paidFee: BorrowingsTable.paidFee,
                    // Explicitly select non-sensitive fields from LibrariansTable
                    librarian: {
                        id: LibrariansTable.id,
                        name: LibrariansTable.name,
                        email: LibrariansTable.email,
                        surname: LibrariansTable.surname,
                    }
                })
                    .from(BorrowingsTable)
                    .innerJoin(LibrariansTable, eq(BorrowingsTable.librarianId, LibrariansTable.id))
                    .innerJoin(StudentsTable, eq(StudentsTable.id, BorrowingsTable.studentId))
                    .innerJoin(ClassesTable, eq(StudentsTable.classId, ClassesTable.id));

                const conditions = []

                if (typeof q.studentId == "number") {
                    conditions.push(eq(BorrowingsTable.studentId, q.studentId));
                }

                if (typeof q.returned == "boolean") {
                    if (q.returned) {
                        conditions.push(isNotNull(BorrowingsTable.returnDate));
                    } else {
                        conditions.push(isNull(BorrowingsTable.returnDate));
                    }
                }

                if (conditions.length > 0) {
                    sqlQuery = sqlQuery.where(and(...conditions));
                }

                break;
            }
            case GetManyType.Fees: {
                sqlQuery = this.db.select().from(FeesTable)
                break;
            }
            case GetManyType.Languages: {
                const q = query as GetManyQuery<GetManyType.Languages>;

                // Base query selecting distinct languages from LanguagesTable
                sqlQuery = this.db
                    .selectDistinct({
                        id: LanguagesTable.id,
                        code: LanguagesTable.code,
                        name: LanguagesTable.name,
                    })
                    .from(LanguagesTable)
                    // Join with BookItemsTable to filter by bookId
                    .innerJoin(BookItemsTable, eq(BookItemsTable.languageId, LanguagesTable.id));

                // Filter by bookId if provided
                if (typeof q.bookId === "number") {
                    sqlQuery = sqlQuery
                        .where(eq(BookItemsTable.bookId, q.bookId))
                }

                break;
            }
            case GetManyType.Librarians: {
                const q = query as GetManyQuery<GetManyType.Librarians>;
                sqlQuery = this.db.select().from(LibrariansTable)

                if (q.phrase) {
                    sqlQuery = sqlQuery.where(sql`
                        (${LibrariansTable.name} || ' ' || ${LibrariansTable.surname}) ILIKE ${q.phrase.toLocaleLowerCase()}
                    `);
                }
                break;
            }
            case GetManyType.Locations: {
                sqlQuery = this.db.select().from(LocationsTable)
                break;
            }
            case GetManyType.Reservations: {
                const q = query as GetManyQuery<GetManyType.Reservations>;
                sqlQuery = this.db.select().from(ReservationsTable);

                const conditions = []

                if (typeof q.studentId === "number") {
                    conditions.push(eq(ReservationsTable.studentId, q.studentId));
                }

                if (typeof q.status === "string") {
                    conditions.push(eq(ReservationsTable.status, q.status));
                }

                if (conditions.length > 0) {
                    sqlQuery = sqlQuery.where(and(...conditions));
                }
                break;
            }
            case GetManyType.Students: {
                const q = query as GetManyQuery<GetManyType.Students>;
                sqlQuery = this.db.selectDistinct().from(StudentsTable)
                    .innerJoin(ClassesTable, eq(ClassesTable.id, StudentsTable.classId))

                const conditions = []

                if (q.phrase) {
                    const searchPhrase = `%${q.phrase}%`; // Add wildcards to match anywhere in the string
                    conditions.push(sql`
            (${StudentsTable.name} || ' ' || ${StudentsTable.surname}) ILIKE ${searchPhrase}
        `);
                }

                if (typeof q.classId == "number") {
                    conditions.push(eq(ClassesTable.id, q.classId))
                }

                if (conditions.length > 0) {
                    sqlQuery = sqlQuery.where(and(...conditions));
                }
                break;
            }
            default: {
                throw new Error("Invalid type");
            }
        }

        const totalAmountQuery = this.db.selectDistinct({ count: sql`COUNT(*)` }).from(sqlQuery.as('subquery'));
        const totalAmount = (await totalAmountQuery)[0].count as number;

        return {
            data: {
                items: (
                    await sqlQuery
                        .limit(range[1] - range[0])
                        .offset(range[0])
                ).map((it: any) => ({ ...it, password: undefined })),
                totalAmount
            }
        }
    }

    async getMostPopularGenresInDateRange(dateRange: [Date, Date], classId: number) {
        return await this.db.select({
            genre: GenresTable,
            amount: sql`count(${GenresTable.id})`.mapWith(Number)
        })
            .from(BorrowingsTable)
            .innerJoin(BookItemsTable, eq(BorrowingsTable.bookItemEan, BookItemsTable.ean))
            .innerJoin(BooksGenresTable, eq(BooksGenresTable.bookId, BookItemsTable.bookId))
            .innerJoin(GenresTable, eq(BooksGenresTable.genreId, GenresTable.id))
            .innerJoin(StudentsTable, eq(StudentsTable.id, BorrowingsTable.studentId))
            .where(and(
                eq(StudentsTable.classId, classId),
                between(BorrowingsTable.borrowingDate, dateRange[0], dateRange[1])
            ))
            .groupBy(GenresTable.id)
    }

    async getMostReadingStudent(dateRange: [Date, Date], classId: number) {
        return await this.db.select({
            student: StudentsTable,
            amount: sql`count(${StudentsTable.id})`.mapWith(Number)
        })
            .from(BorrowingsTable)
            .innerJoin(StudentsTable, eq(StudentsTable.id, BorrowingsTable.studentId))
            .where(and(
                eq(StudentsTable.classId, classId),
                between(BorrowingsTable.borrowingDate, dateRange[0], dateRange[1])
            ))
            .groupBy(StudentsTable.id)
    }
}