import { AuthLevel } from "./createRoute/AuthLevel"
import { Method } from "./createRoute/Method"
import createRoute from "./createRoute/createRoute"

export const Reports_Download_Route = createRoute("/reports/download", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ params, api, user }) {
        throw new Error("ToDo")
    },
})

export const Reports_GetAllGenerated_Route = createRoute("/reports/get-all-generated", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ params, api, user }) {
        throw new Error("ToDo")
    },
})

export const Reports_RequestCreation_Route = createRoute("/reports/request-creation", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ params, api, user }) {
        throw new Error("ToDo")
    },
})