import { AuthorsTable } from "../DB/schema/AuthorsTable"
import { BookItemsTable } from "../DB/schema/BookItemsTable"
import { BooksTable } from "../DB/schema/BooksTable"
import { FeesTable } from "../DB/schema/FeesTable"
import { GenresTable } from "../DB/schema/GenresTable"
import { LanguagesTable } from "../DB/schema/LanguagesTable"
import { LocationsTable } from "../DB/schema/LocationsTable"
import { StudentsTable } from "../DB/schema/StudentsTable"
import { AuthLevel } from "./createRoute/AuthLevel"
import { Method } from "./createRoute/Method"
import createRoute from "./createRoute/createRoute"

export const ObjectActionCrud_Path = createRoute("/:object-type/:action", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ pathsParams, api, user, _native }) {
        enum ObjectType {
            Authors = "authors",
            Books = "books",
            Genres = "genres",
            Fees = "fees",
            Languages = "languages",
            Locations = "locations",
            Students = "students",
            Messages = "messages",
            BookItems = "book-items",
            Reports = "reports"
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
})