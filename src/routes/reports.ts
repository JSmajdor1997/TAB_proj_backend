import { z } from "zod"
import { AuthLevel } from "./createRoute/AuthLevel"
import { Method } from "./createRoute/Method"
import createRoute from "./createRoute/createRoute"

export const Reports_Get_Most_Popular_Genres_Route = createRoute("/reports/get-most-popular-genres", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        dateRange: z.tuple([z.date(), z.date()]),
        classId: z.number().int().positive()
    }),
    querySchema: undefined,
    async handler({ params, api, user }) {
        return {
            data: await api.getMostPopularGenresInDateRange(params.dateRange, params.classId)
        }
    },
})

export const Reports_Get_Most_Reading_Student_Route = createRoute("/reports/get-most-reading-student", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        dateRange: z.tuple([z.date(), z.date()]),
        classId: z.number().int().positive()
    }),
    querySchema: undefined,
    async handler({ params, api, user }) {
        return {
            data: await api.getMostReadingStudent(params.dateRange, params.classId)
        }
    },
})