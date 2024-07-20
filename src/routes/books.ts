import { z } from "zod"
import { AuthLevel } from "./createRoute/AuthLevel"
import createRoute from "./createRoute/createRoute"
import { Method } from "./createRoute/Method"

export const Books_Return_Route = createRoute("/books/return", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        bookItemId: z.number(),
        fee: z.number()
    }),
    querySchema: undefined,
    async handler({ params: { bookItemId, fee }, api, user }) {
        return {
            data: api.returnBookItem(bookItemId, fee)
        }
    },
})

export const Books_Reserve_Route = createRoute("/books/reserve", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        studentId: z.number(),
        bookId: z.number()
    }),
    querySchema: undefined,
    async handler({ params: { studentId, bookId }, api, user }) {
        return {
            data: api.reserveBook(studentId, bookId)
        }
    },
})

export const Books_Lend_Route = createRoute("/books/lend", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        studentId: z.number(), 
        bookItemId: z.number()
    }),
    querySchema: undefined,
    async handler({ params: { studentId, bookItemId }, api, user }) {
        return {
            data: api.lendBook(user.user.id, studentId, bookItemId)
        }
    },
})

export const Books_CancelReservation_Route = createRoute("/books/cancel-reservation", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        reservationId: z.number(),
    }),
    querySchema: undefined,
    async handler({ params: { reservationId }, api, user }) {
        return {
            data: api.cancelReservation(reservationId)
        }
    },
})