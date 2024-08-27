"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOneAction_Path = exports.GetManyAction_Path = exports.UpdateOneAction_Path = exports.DeleteOneAction_Path = exports.CreateOneAction_Path = void 0;
const zod_1 = require("zod");
const AuthLevel_1 = require("./createRoute/AuthLevel");
const Method_1 = require("./createRoute/Method");
const createRoute_1 = __importDefault(require("./createRoute/createRoute"));
const drizzle_zod_1 = require("drizzle-zod");
const AuthorsTable_1 = require("../DB/schema/AuthorsTable");
const BookItemsTable_1 = require("../DB/schema/BookItemsTable");
const BooksTable_1 = require("../DB/schema/BooksTable");
const GenresTable_1 = require("../DB/schema/GenresTable");
const LanguagesTable_1 = require("../DB/schema/LanguagesTable");
const LibrariansTable_1 = require("../DB/schema/LibrariansTable");
const LocationsTable_1 = require("../DB/schema/LocationsTable");
exports.CreateOneAction_Path = (0, createRoute_1.default)("/crud/:objectType/create-one", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        item: zod_1.z.union([
            (0, drizzle_zod_1.createInsertSchema)(AuthorsTable_1.AuthorsTable),
            (0, drizzle_zod_1.createInsertSchema)(LocationsTable_1.LocationsTable),
            (0, drizzle_zod_1.createInsertSchema)(LibrariansTable_1.LibrariansTable),
            (0, drizzle_zod_1.createInsertSchema)(LanguagesTable_1.LanguagesTable),
            (0, drizzle_zod_1.createInsertSchema)(GenresTable_1.GenresTable),
            (0, drizzle_zod_1.createInsertSchema)(BookItemsTable_1.BookItemsTable),
            (0, drizzle_zod_1.createInsertSchema)(BooksTable_1.BooksTable),
        ])
    }),
    querySchema: undefined,
    handler: (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, pathsParams, params: { item } }) {
        return {
            data: api.createOne(pathsParams.objectType, item)
        };
    }),
});
exports.DeleteOneAction_Path = (0, createRoute_1.default)("/crud/:objectType/delete-one", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        id: zod_1.z.number()
    }),
    querySchema: undefined,
    handler: (_b) => __awaiter(void 0, [_b], void 0, function* ({ api, pathsParams, params: { id } }) {
        return {
            data: api.deleteOne(pathsParams.objectType, id)
        };
    }),
});
exports.UpdateOneAction_Path = (0, createRoute_1.default)("/crud/:objectType/update-one", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        id: zod_1.z.number(),
        item: zod_1.z.any()
    }),
    querySchema: undefined,
    handler: (_c) => __awaiter(void 0, [_c], void 0, function* ({ api, pathsParams, params: { id, item } }) {
        return {
            data: api.updateOne(pathsParams.objectType, id, item)
        };
    }),
});
exports.GetManyAction_Path = (0, createRoute_1.default)("/crud/:objectType/get-many", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        range: zod_1.z.any(),
        query: zod_1.z.any(),
    }),
    querySchema: undefined,
    handler: (_d) => __awaiter(void 0, [_d], void 0, function* ({ api, pathsParams, params: { range, query } }) {
        return {
            data: api.getMany(pathsParams.objectType, query, range)
        };
    }),
});
exports.GetOneAction_Path = (0, createRoute_1.default)("/crud/:objectType/get-one", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        id: zod_1.z.number()
    }),
    querySchema: undefined,
    handler: (_e) => __awaiter(void 0, [_e], void 0, function* ({ api, pathsParams, params: { id } }) {
        return {
            data: api.getOne(pathsParams.objectType, id)
        };
    }),
});
