import { z } from "zod"
import { CreateOneType } from "../API/params/CreateOne"
import { DeleteOneType } from "../API/params/DeleteOne"
import { GetManyType } from "../API/params/GetMany"
import { GetOneType } from "../API/params/GetOne"
import { UpdateOneType } from "../API/params/UpdateOne"
import { AuthLevel } from "./createRoute/AuthLevel"
import { Method } from "./createRoute/Method"
import createRoute from "./createRoute/createRoute"
import { createInsertSchema } from "drizzle-zod"
import { AuthorsTable } from "../DB/schema/AuthorsTable"
import { BookItemsTable } from "../DB/schema/BookItemsTable"
import { BooksTable } from "../DB/schema/BooksTable"
import { GenresTable } from "../DB/schema/GenresTable"
import { LanguagesTable } from "../DB/schema/LanguagesTable"
import { LibrariansTable } from "../DB/schema/LibrariansTable"
import { LocationsTable } from "../DB/schema/LocationsTable"

export const CreateOneAction_Path = createRoute("/crud/:objectType/create-one", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        item: z.union([
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
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        range: z.any(),
        query: z.any(),
    }),
    querySchema: undefined,
    handler: async ({ api, pathsParams, params: { range, query } }) => {
        return {
            data: api.getMany(pathsParams.objectType as any, query, range)
        }
    },
})

export const GetOneAction_Path = createRoute("/crud/:objectType/get-one", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        id: z.number()
    }),
    querySchema: undefined,
    handler: async ({ api, pathsParams, params: { id } }) => {
        return {
            data: api.getOne(pathsParams.objectType as any, id)
        }
    },
})