import FrontEndAPI, { UserType } from "./API/FrontEndAPI";
import { CreateOneType } from "./API/params/CreateOne";
import { DeleteOneType } from "./API/params/DeleteOne";
import { GetManyType } from "./API/params/GetMany";
import { GetOneType } from "./API/params/GetOne";
import { UpdateOneType } from "./API/params/UpdateOne";
import { Author } from "./DB/schema/AuthorsTable";

async function testAuthor(api: FrontEndAPI) {
    const itemToCreate = {
        name: "Marek",
        surname: "Barek",
        birthDate: new Date()
    }

    const createdItem = await api.createOne(CreateOneType.Author, itemToCreate)
    const many = await api.getMany(GetManyType.Authors, {phrase: "ma"}, [0, 100])
    console.log(many)
}

export default async function testFrontend() {
    const api = new FrontEndAPI("https://127.0.0.1:3000")

    await api.login(UserType.Librarian, "admin@admin.pl", "zaq1@WSX")

    testAuthor(api)
    return
    
    //testing creating items
    
    // api.createOne(CreateOneType.Book, {})
    // api.createOne(CreateOneType.BookItem, {})
    // api.createOne(CreateOneType.Genre, {})
    // api.createOne(CreateOneType.Language, {})
    // api.createOne(CreateOneType.Librarian, {})
    // api.createOne(CreateOneType.Location, {})

    // //testing getting many and if creation was completed  |  also TEST WITH QUERY PARAMS
    // const authors = await api.getMany(GetManyType.BookItems, {}, [0, 100])
    // const authors = await api.getMany(GetManyType.Books, {}, [0, 100])
    // const authors = await api.getMany(GetManyType.Borrowings, {}, [0, 100])
    // const authors = await api.getMany(GetManyType.Fees, {}, [0, 100])
    // const authors = await api.getMany(GetManyType.Languages, {}, [0, 100])
    // const authors = await api.getMany(GetManyType.Librarians, {}, [0, 100])
    // const authors = await api.getMany(GetManyType.Locations, {}, [0, 100])
    // const authors = await api.getMany(GetManyType.Reservations, {}, [0, 100])
    // const authors = await api.getMany(GetManyType.Students, {}, [0, 100])


    // //testing updating single
    // api.updateOne(UpdateOneType.Author)
    // api.updateOne(UpdateOneType.Book)
    // api.updateOne(UpdateOneType.BookItem)
    // api.updateOne(UpdateOneType.Fees)
    // api.updateOne(UpdateOneType.Genre)
    // api.updateOne(UpdateOneType.Language)
    // api.updateOne(UpdateOneType.Location)


    // //testing getting single
    // const srakulec = await api.getOne(GetOneType.Author)
    // const srakulec = await api.getOne(GetOneType.Genre)
    // const srakulec = await api.getOne(GetOneType.Librarian)
    // const srakulec = await api.getOne(GetOneType.Student)


    // //testing deletion
    // await api.deleteOne(DeleteOneType.Author)
    // await api.deleteOne(DeleteOneType.Book)
    // await api.deleteOne(DeleteOneType.BookItem)
    // await api.deleteOne(DeleteOneType.Genre)
    // await api.deleteOne(DeleteOneType.Language)
    // await api.deleteOne(DeleteOneType.Location)
    // await api.deleteOne(DeleteOneType.Fees)


    // //testing getting current user
    // api.getCurrentUser()
}