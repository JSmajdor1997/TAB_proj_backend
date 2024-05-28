import { AuthLevel } from "./createRoute/AuthLevel"
import { Method } from "./createRoute/Method"
import createRoute from "./createRoute/createRoute"

export const BookItems_Lend_Route = createRoute("/book-items/lend", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ params, api, user }) {
        throw new Error("ToDo")
    },
})

export const BookItems_Return_Route = createRoute("/book-items/return", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ params, api, user }) {
        throw new Error("ToDo")
    },
})