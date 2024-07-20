import FrontEndAPI, { UserType } from "./API/FrontEndAPI";
import { GetManyType } from "./API/params/GetMany";

export default async function testFrontend() {
    const api = new FrontEndAPI("https://127.0.0.1:3000")

    await api.login(UserType.Librarian, "admin@admin.pl", "zaq1@WSX")

    const authors = await api.getMany(GetManyType.Authors, {}, [0, 100])
}