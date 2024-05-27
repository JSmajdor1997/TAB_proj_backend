import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import getMockupDB from "./DB/getMockupDB";
import getProductionDB from "./DB/getProductionDB";
import getEnv from "./getEnv";
import Logger from "./Logger/Logger";
import LogLevel from "./Logger/LogLevel";
import Route, { AuthLevel, Method } from "./routes/Route";
import DB from "./DB/DB";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LibrariansTable, NewLibrarian } from "./DB/schema/LibrariansTable";
import bcrypt from "bcrypt"
import API from "./API/API";
import z from "zod"
import createRoute from "./routes/createRoute";
import StatusCode from "status-code-enum";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { table } from "console";
import { AuthorsTable } from "./DB/schema/AuthorsTable";
import { BooksTable } from "./DB/schema/BooksTable";
import { GenresTable } from "./DB/schema/GenresTable";
import { FeesTable } from "./DB/schema/FeesTable";
import { LanguagesTable } from "./DB/schema/LanguagesTable";
import { LocationsTable } from "./DB/schema/LocationsTable";
import { StudentsTable } from "./DB/schema/StudentsTable";
import { BookItemsTable } from "./DB/schema/BookItemsTable";

dotenv.config();

//create-user

async function main() {
    const env = getEnv()

    const db: DB = env.NODE_ENV == "development" ?
        await getMockupDB() :
        await getProductionDB()

    const logger = new Logger([LogLevel.Error, LogLevel.Info])

    const app = express();
    app.disable("x-powered-by");
    app.use(cors())
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    const api = new API(db, logger.log.bind(logger))

    enum UserCreationError {
        UserAlreadyExists = 0
    }

    enum SettingPasswordError {
        InvalidOldPasswordProvided = 0
    }

    const routes = {
        ["/:object-type/:action"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            pathSchema: undefined,
            querySchema: undefined,
            async handler({ params, api, user }) {
                enum ObjectType {
                    Authors,
                    Books,
                    Genres,
                    Fees,
                    Languages,
                    Locations,
                    Students,
                    Messages,
                    BookItems,
                    Reports
                }

                enum Actions {
                    GetDetails,
                    GetAll,
                    Update,
                    Create,
                    Remove
                }

                //validators, api methods, etc
                const config = {
                    [ObjectType.Authors]: {
                        table: AuthorsTable,
                        [Actions.GetAll]: {},
                        [Actions.Update]: {},
                        [Actions.Create]: {},
                        [Actions.Remove]: {},
                    },
                    [ObjectType.Books]: {
                        table: BooksTable,
                        [Actions.GetAll]: {},
                        [Actions.Update]: {},
                        [Actions.Create]: {},
                        [Actions.Remove]: {},
                    },
                    [ObjectType.Genres]: {
                        table: GenresTable,
                        [Actions.GetAll]: {},
                        [Actions.Update]: {},
                        [Actions.Create]: {},
                        [Actions.Remove]: {},
                    },
                    [ObjectType.Fees]: {
                        table: FeesTable,
                        [Actions.GetAll]: {},
                        [Actions.Update]: {},
                        [Actions.Create]: {},
                        [Actions.Remove]: {},
                    },
                    [ObjectType.Languages]: {
                        table: LanguagesTable,
                        [Actions.GetAll]: {},
                        [Actions.Update]: {},
                        [Actions.Create]: {},
                        [Actions.Remove]: {},
                    },
                    [ObjectType.Locations]: {
                        table: LocationsTable,
                        [Actions.GetAll]: {},
                        [Actions.Update]: {},
                        [Actions.Create]: {},
                        [Actions.Remove]: {},
                    },
                    [ObjectType.Students]: {
                        table: StudentsTable,
                        [Actions.GetDetails]: {},
                        [Actions.GetAll]: {},
                        [Actions.Update]: {},
                    },
                    [ObjectType.BookItems]: {
                        table: BookItemsTable,
                        [Actions.GetDetails]: {},
                        [Actions.GetAll]: {},
                        [Actions.Update]: {},
                        [Actions.Create]: {},
                        [Actions.Remove]: {},
                    }
                }

                throw new Error("ToDo")
            },
        }),
        ["/book-items/lend"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            pathSchema: undefined,
            querySchema: undefined,
            async handler({ params, api, user }) {
                throw new Error("ToDo")
            },
        }),
        ["/book-items/return"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            pathSchema: undefined,
            querySchema: undefined,
            async handler({ params, api, user }) {
                throw new Error("ToDo")
            },
        }),
        ["/messages/send"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            pathSchema: undefined,
            querySchema: undefined,
            async handler({ params, api, user }) {
                throw new Error("ToDo")
            },
        }),
        ["/report/download"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            pathSchema: undefined,
            querySchema: undefined,
            async handler({ params, api, user }) {
                throw new Error("ToDo")
            },
        }),
        ["/report/get-all-generated"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            pathSchema: undefined,
            querySchema: undefined,
            async handler({ params, api, user }) {
                throw new Error("ToDo")
            },
        }),
        ["/report/request-creation"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            pathSchema: undefined,
            querySchema: undefined,
            async handler({ params, api, user }) {
                throw new Error("ToDo")
            },
        }),
        ["/user/reset-password"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.None,
            bodySchema: z.object({
                email: z.string(),
            }),
            querySchema: undefined,
            pathSchema: undefined,
            async handler({ params: { email }, api, user }) {
                throw new Error("ToDo")
            },
        }),
        ["/user/remove-user"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: z.object({
                librarianId: z.number().int()
            }),
            querySchema: undefined,
            pathSchema: undefined,
            async handler({ params: { librarianId }, api, user }) {
                throw new Error("ToDo")
            },
        }),
        ["/user/set-password"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: z.object({
                oldPassword: z.string(),
                newPassword: z.string()
            }),
            querySchema: undefined,
            pathSchema: undefined,
            async handler({ params: { oldPassword, newPassword }, api, user }) {
                //jeśli hasło - tylko jeśli to my
                if(await api.getLibrarian(user.user.email, oldPassword) == null) {
                    return {
                        error: {
                            code: StatusCode.ClientErrorBadRequest,
                            customCode: SettingPasswordError.InvalidOldPasswordProvided,
                            message: "Invalid old password provided"
                        }
                    }
                }

                await api.setPassword(user.user, newPassword)
                
                return {
                    data: "OK"
                }
            },
        }),
        ["/user/update-user"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: z.object({
                librarianId: z.number().int().min(0),
                updateObject: createSelectSchema(LibrariansTable).omit({password: true})
            }),
            querySchema: undefined,
            pathSchema: undefined,
            async handler({ params: { librarianId, updateObject }, api }) {                      
                return {
                    data: {
                        updatedLibrarian: await api.updateLibrarian(librarianId, updateObject)
                    }
                }
            },
        }),
        ["/user/get-users"]: createRoute({
            method: Method.GET,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            pathSchema: undefined,
            querySchema: z.object({
                phrase: z.string().email()
            }),
            async handler({ params: { phrase }, api }) {
                return {
                    data: api.getLibrarians(phrase)
                }
            },
        }),
        ["/user/create"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: z.object({
                email: z.string().email(),
                name: z.string().min(1).max(256),
                surname: z.string().min(1).max(256)
            }),
            querySchema: undefined,
            pathSchema: undefined,
            async handler({ params: { email, name, surname }, api }) {
                //check if exists
                if (await api.librarianExists(email)) {
                    return {
                        error: {
                            code: StatusCode.ClientErrorBadRequest,
                            customCode: UserCreationError.UserAlreadyExists,
                            message: "User with email already exists"
                        }
                    }
                } else {
                    return {
                        data: await api.createLibrarian({
                            email,
                            name,
                            surname
                        })
                    }
                }
            },
        }),
        ["/user/login"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.None,
            bodySchema: z.object({
                email: z.string().email(),
                password: z.string()
            }),
            querySchema: undefined,
            pathSchema: undefined,
            async handler({ params, user }) {
                if (user.user != null) {
                    return {
                        error: {
                            code: StatusCode.ClientErrorBadRequest,
                            message: "User already logged in!"
                        }
                    }
                } else {
                    const result = await user.login(params.email, params.password)
                    if (result == null) {
                        return {
                            error: {
                                code: StatusCode.ClientErrorBadRequest,
                                message: "User does not exist or invalid password provided"
                            }
                        }
                    }

                    return {
                        data: "User logged in"
                    }
                }
            },
        }),
        ["/user/logout"]: createRoute({
            method: Method.POST,
            authLevel: AuthLevel.Librarian,
            bodySchema: undefined,
            querySchema: undefined,
            pathSchema: undefined,
            async handler({ user }) {
                if (await user.logout()) {
                    return {
                        data: "User logged out"
                    }
                }

                return {
                    error: {
                        code: StatusCode.ServerErrorInternal,
                        message: "Unknown error occurred"
                    }
                }
            },
        })
    }

    for (const path of Object.keys(routes)) {
        const route = routes[path as keyof typeof routes](api, logger)
        const func = route.method == Method.POST ? app.post : app.get

        func(path, route.handler)
    }

    app.listen(env.PORT, () => {
        logger.log(LogLevel.Info, "server", `fully initialized, listens on port ${env.PORT}`)
    });
}

// main()