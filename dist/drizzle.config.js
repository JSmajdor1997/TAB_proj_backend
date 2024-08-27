"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const getEnv_1 = __importDefault(require("./src/getEnv"));
const path_1 = __importDefault(require("path"));
const env = (0, getEnv_1.default)();
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/DB/schema/*',
    out: path_1.default.join("./", env.MIGRATION_CATALOG),
    dialect: 'postgresql',
    dbCredentials: {
        host: env.DATABASE_URL,
        port: env.PORT,
        user: env.DATABASE_USER_NAME,
        password: env.DATABASE_USER_PASSWORD,
        database: env.DATABASE_NAME,
    },
});
