import { SQL, and, eq } from "drizzle-orm";
import DB from "../DB/DB";
import { Librarian, LibrariansTable, NewLibrarian } from "../DB/schema/LibrariansTable";
import Logger from "../Logger/Logger";
import bcrypt from "bcrypt"
import LogLevel from "../Logger/LogLevel";

//abstracts away DB operations
export default class API {
    private static getDefaultLibrarian = () => API.hashPassword("zaq1@WSX").then(hashedPassword => ({
        name: "admin",
        surname: "admin",
        email: "admin@admin.pl",
        password: hashedPassword
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
        //create defaults user if does not exist
        API.getDefaultLibrarian().then(defaultLibrarian => {
            this.getLibrarian({ email: defaultLibrarian.email }).then(async existing => {
                if (existing == null) {
                    logger.log(LogLevel.Info, "default user not found - creating")
                    await db.insert(LibrariansTable).values(defaultLibrarian)
                } else {
                    logger.log(LogLevel.Success, "default user found")
                }

                logger.log(LogLevel.Success, "initialized")
            })
        })
    }

    async getLibrarian({ email, id, password }: { email?: string, id?: number, password?: string }): Promise<Librarian | null> {
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