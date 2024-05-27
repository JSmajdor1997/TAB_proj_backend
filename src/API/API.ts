import DB from "../DB/DB";
import { Librarian, LibrariansTable, NewLibrarian } from "../DB/schema/LibrariansTable";
import Logger from "../Logger/Logger";
import bcrypt from "bcrypt"

//abstracts away DB operations
export default class API {
    private static hashPassword(password: string) {
        return bcrypt.hash(password, bcrypt.genSaltSync(10))
    }

    constructor(
        private readonly db: DB,
        private readonly logger: Logger["log"]
    ) {
        //create defaults user if does not exist
        const defaultUser = db.select().from(LibrariansTable).where()

        if (defaultUser == null) {
            db.insert(LibrariansTable).values({
                name: "admin",
                surname: "admin",
                email: "admin@admin.pl",
                password: API.hashPassword("zaq1@WSX")
            })
        }
    }

    async isValidPassword(email: string, password: string): Promise<boolean> {

    }

    async getLibrarian(email: string, password: string): Promise<Librarian | null> {

    }

    async setPassword(librarian: Librarian, newPassword: string): Promise<void> {

    }

    async createLibrarian(librarian: Omit<NewLibrarian, "password">): Promise<Librarian> {

    }

    async updateLibrarian(librarianId: number, updateObject: Partial<NewLibrarian>): Promise<Librarian> {

    }

    async librarianExists(email: string): Promise<boolean> {

    }

    async getLibrarianById(id: number): Promise<Librarian | null> {

    }

    async getLibrarians(phrase: string): Promise<Librarian[]> {

    }

    async isBlacklisted(token: string): Promise<boolean> {
        await Blacklist.findOne({ token: accessToken })
    }

    async addToBlacklist(token: string) {

    }

    //...
}