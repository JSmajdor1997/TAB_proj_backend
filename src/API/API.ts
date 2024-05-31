import { SQL, and, eq } from "drizzle-orm";
import DB from "../DB/DB";
import { Librarian, LibrariansTable, NewLibrarian } from "../DB/schema/LibrariansTable";
import Logger from "../Logger/Logger";
import bcrypt from "bcrypt"
import LogLevel from "../Logger/LogLevel";
import { Student, StudentsTable } from "../DB/schema/StudentsTable";
import mockupClasses from "../DB/mockup_data/generators/mockupClasses";

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

    async setPassword(librarian: Librarian, newPassword: string): Promise<void> {
        this.logger.log(LogLevel.Warning, "changing password not implemented")
        throw new Error("ToDo!")
    }

    async getLibrarians(phrase: string): Promise<Librarian[]> {
        return this.db.select().from(LibrariansTable)
    }
}