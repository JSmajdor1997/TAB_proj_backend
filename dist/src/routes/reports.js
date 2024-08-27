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
exports.Reports_RequestCreation_Route = exports.Reports_GetAllGenerated_Route = exports.Reports_Download_Route = void 0;
const AuthLevel_1 = require("./createRoute/AuthLevel");
const Method_1 = require("./createRoute/Method");
const createRoute_1 = __importDefault(require("./createRoute/createRoute"));
exports.Reports_Download_Route = (0, createRoute_1.default)("/reports/download", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, api, user }) {
            throw new Error("ToDo");
        });
    },
});
exports.Reports_GetAllGenerated_Route = (0, createRoute_1.default)("/reports/get-all-generated", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, api, user }) {
            throw new Error("ToDo");
        });
    },
});
exports.Reports_RequestCreation_Route = (0, createRoute_1.default)("/reports/request-creation", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, api, user }) {
            throw new Error("ToDo");
        });
    },
});
