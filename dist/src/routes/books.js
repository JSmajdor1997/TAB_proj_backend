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
exports.Books_CancelReservation_Route = exports.Books_Lend_Route = exports.Books_Reserve_Route = exports.Books_Return_Route = void 0;
const zod_1 = require("zod");
const AuthLevel_1 = require("./createRoute/AuthLevel");
const createRoute_1 = __importDefault(require("./createRoute/createRoute"));
const Method_1 = require("./createRoute/Method");
exports.Books_Return_Route = (0, createRoute_1.default)("/books/return", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        bookItemId: zod_1.z.number(),
        fee: zod_1.z.number()
    }),
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params: { bookItemId, fee }, api, user }) {
            return {
                data: api.returnBookItem(bookItemId, fee)
            };
        });
    },
});
exports.Books_Reserve_Route = (0, createRoute_1.default)("/books/reserve", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        studentId: zod_1.z.number(),
        bookId: zod_1.z.number()
    }),
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params: { studentId, bookId }, api, user }) {
            return {
                data: api.reserveBook(studentId, bookId)
            };
        });
    },
});
exports.Books_Lend_Route = (0, createRoute_1.default)("/books/lend", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        studentId: zod_1.z.number(),
        bookItemId: zod_1.z.number()
    }),
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params: { studentId, bookItemId }, api, user }) {
            return {
                data: api.lendBook(user.user.id, studentId, bookItemId)
            };
        });
    },
});
exports.Books_CancelReservation_Route = (0, createRoute_1.default)("/books/cancel-reservation", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        reservationId: zod_1.z.number(),
    }),
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params: { reservationId }, api, user }) {
            return {
                data: api.cancelReservation(reservationId)
            };
        });
    },
});
