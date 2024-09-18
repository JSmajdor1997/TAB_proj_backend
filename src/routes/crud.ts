import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { GetManyQuery, GetManyType } from "../API/params/GetMany"
import { AuthorsTable } from "../DB/schema/AuthorsTable"
import { BookItemsTable } from "../DB/schema/BookItemsTable"
import { BooksTable } from "../DB/schema/BooksTable"
import { GenresTable } from "../DB/schema/GenresTable"
import { LanguagesTable } from "../DB/schema/LanguagesTable"
import { LibrariansTable } from "../DB/schema/LibrariansTable"
import { LocationsTable } from "../DB/schema/LocationsTable"
import { StudentsTable } from "../DB/schema/StudentsTable"
import { AuthLevel } from "./createRoute/AuthLevel"
import { Method } from "./createRoute/Method"
import createRoute from "./createRoute/createRoute"
import { GetOneType } from "../API/params/GetOne"
import { Reservation } from "../DB/schema/ReservationsTable"
import { Borrowing } from "../DB/schema/BorrowingsTable"

export const CreateOneAction_Path = createRoute("/crud/:objectType/create-one", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        item: z.union([
            createInsertSchema(StudentsTable),
            createInsertSchema(AuthorsTable),
            createInsertSchema(LocationsTable),
            createInsertSchema(LibrariansTable),
            createInsertSchema(LanguagesTable),
            createInsertSchema(GenresTable),
            createInsertSchema(BookItemsTable),
            createInsertSchema(BooksTable),
        ])
    }),
    querySchema: undefined,
    handler: async ({ api, pathsParams, params: { item } }) => {
        return {
            data: api.createOne(pathsParams.objectType as any, item)
        }
    },
})

export const DeleteOneAction_Path = createRoute("/crud/:objectType/delete-one", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        id: z.number()
    }),
    querySchema: undefined,
    handler: async ({ api, pathsParams, params: { id } }) => {
        return {
            data: api.deleteOne(pathsParams.objectType as any, id)
        }
    },
})

export const UpdateOneAction_Path = createRoute("/crud/:objectType/update-one", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        id: z.number(),
        item: z.any()
    }),
    querySchema: undefined,
    handler: async ({ api, pathsParams, params: { id, item } }) => {
        return {
            data: api.updateOne(pathsParams.objectType as any, id, item)
        }
    },
})

export const GetManyAction_Path = createRoute("/crud/:objectType/get-many", {
    method: Method.POST,
    authLevel: AuthLevel.AnyAuthorized,
    bodySchema: z.object({
        range: z.any(),
        query: z.any(),
    }),
    querySchema: undefined,
    handler: async ({ api, pathsParams, user, params: { range, query } }) => {
        if(user.user.userType == AuthLevel.Student && ![GetManyType.BookItems, GetManyType.Authors, GetManyType.Languages, GetManyType.Genres, GetManyType.Books, GetManyType.Borrowings, GetManyType.Reservations].includes(pathsParams.objectType as GetManyType)) {
            return {
                error: {
                    code: 400,
                    message: "Not authorized",
                    customCode: "chciałoby się"
                }
            }
        }

        if([GetManyType.Borrowings, GetManyType.Reservations].includes(pathsParams.objectType as GetManyType) && user.user.userType == AuthLevel.Student) {
            const q = (query as GetManyQuery<GetManyType.Borrowings | GetManyType.Reservations>)

            if(q.studentId !== user.user.id) {
                return {
                    error: {
                        code: 400,
                        message: "Not authorized, students may only access own borrowings",
                        customCode: "chciałoby się"
                    }
                }
            }
        }

        return {
            data: api.getMany(pathsParams.objectType as any, query, range)
        }
    },
})

export const GetOneAction_Path = createRoute("/crud/:objectType/get-one", {
    method: Method.POST,
    authLevel: AuthLevel.AnyAuthorized,
    bodySchema: z.object({
        id: z.number()
    }),
    querySchema: undefined,
    handler: async ({ api, pathsParams, user, params: { id } }) => {
        if(user.user.userType == AuthLevel.Student && ![GetOneType.BookItem, GetOneType.Author, GetOneType.Genre, GetOneType.Book, GetOneType.Borrowing, GetOneType.Reservation].includes(pathsParams.objectType as GetOneType)) {
            return {
                error: {
                    code: 400,
                    message: "Not authorized",
                    customCode: "chciałoby się"
                }
            }
        }

        if([GetOneType.Reservation, GetOneType.Borrowing].includes(pathsParams.objectType as GetOneType)) {
            const item = await api.getOne<GetOneType.Reservation>(GetOneType.Reservation, id)
            
            if(item.error == null || (item.data as Reservation | Borrowing).studentId != user.user.id) {
                return {
                    error: {
                        code: 400,
                        message: "Not authorized",
                        customCode: "chciałoby się"
                    }
                }
            } 
        }

        return {
            data: api.getOne(pathsParams.objectType as any, id)
        }
    },
})