import { AuthLevel } from "./createRoute/AuthLevel"
import { Method } from "./createRoute/Method"
import createRoute from "./createRoute/createRoute"

export const Messages_Send_Route = createRoute("/messages/send", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ params, api, user }) {
        throw new Error("ToDo")
    },
})

export const Messages_Get_Route = createRoute("/messages/get", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ params, api, user }) {
        throw new Error("ToDo")
    },
})