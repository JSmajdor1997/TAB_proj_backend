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
const promise_1 = __importDefault(require("mysql2/promise")); // Use mysql2 with promises for async/await support
const getEnv_1 = __importDefault(require("../getEnv"));
const mysql2_1 = require("drizzle-orm/mysql2");
function getProductionDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const env = (0, getEnv_1.default)();
        const connection = yield promise_1.default.createPool({
            host: env.DATABASE_URL,
            port: env.DATABASE_PORT,
            user: env.DATABASE_USER_NAME,
            password: env.DATABASE_USER_PASSWORD,
            database: env.DATABASE_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        return (0, mysql2_1.drizzle)(connection);
    });
}
exports.default = getProductionDB;
