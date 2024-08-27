"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FrontEndAPI_1 = __importStar(require("./API/FrontEndAPI"));
const CreateOne_1 = require("./API/params/CreateOne");
const GetMany_1 = require("./API/params/GetMany");
function testAuthor(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemToCreate = {
            name: "Marek",
            surname: "Barek",
            birthDate: new Date()
        };
        const createdItem = yield api.createOne(CreateOne_1.CreateOneType.Author, itemToCreate);
        const many = yield api.getMany(GetMany_1.GetManyType.Authors, { phrase: "ma" }, [0, 100]);
        console.log(many);
    });
}
function testFrontend() {
    return __awaiter(this, void 0, void 0, function* () {
        const api = new FrontEndAPI_1.default("https://127.0.0.1:3000");
        yield api.login(FrontEndAPI_1.UserType.Librarian, "admin@admin.pl", "zaq1@WSX");
        testAuthor(api);
        return;
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
    });
}
exports.default = testFrontend;
