import { z } from "zod"
import { AuthLevel } from "./createRoute/AuthLevel"
import createRoute from "./createRoute/createRoute"
import { Method } from "./createRoute/Method"

export const Messages_SendMessage_Route = createRoute("/messages/send", {
    method: Method.POST,
    authLevel: AuthLevel.AnyAuthorized,
    bodySchema: z.object({
        studentId: z.number(),
        content: z.string()
    }),
    querySchema: undefined,
    async handler({ params: { studentId, content }, api, user }) {
        return {
            data: api.sendMessage(studentId, content, user.user.userType == AuthLevel.Librarian)
        }
    },
})

export const Messages_GetMessages_Route = createRoute("/messages/get", {
    method: Method.POST,
    authLevel: AuthLevel.AnyAuthorized,
    bodySchema: z.object({
        studentId: z.number(),
        range: z.array(z.number())
    }),
    querySchema: undefined,
    async handler({ params: { studentId, range }, api, user }) {
        if (range.length != 2) {
            throw new Error("Range must be two element numerical array")
        }

        return {
            data: api.getMessages(studentId, range as any)
        }
    },
})