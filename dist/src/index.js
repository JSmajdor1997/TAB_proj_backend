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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const getMockupDB_1 = __importDefault(require("./DB/getMockupDB"));
const getProductionDB_1 = __importDefault(require("./DB/getProductionDB"));
const getEnv_1 = __importDefault(require("./getEnv"));
const Logger_1 = __importDefault(require("./Logger/Logger"));
const LogLevel_1 = __importDefault(require("./Logger/LogLevel"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const API_1 = __importDefault(require("./API/API"));
const Method_1 = require("./routes/createRoute/Method");
const reports_1 = require("./routes/reports");
const user_1 = require("./routes/user");
const StatusCode_1 = __importDefault(require("./utils/StatusCode"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const books_1 = require("./routes/books");
const crud_1 = require("./routes/crud");
const JSONHelpers_1 = __importDefault(require("./utils/JSONHelpers"));
const faker_1 = require("@faker-js/faker");
dotenv_1.default.config();
faker_1.faker.seed(0);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        const logger = new Logger_1.default(["server"]);
        logger.log(LogLevel_1.default.Info, "console test");
        logger.log(LogLevel_1.default.Success, "console test");
        logger.log(LogLevel_1.default.Warning, "console test");
        logger.log(LogLevel_1.default.Error, "console test");
        logger.log(LogLevel_1.default.CriticalError, "console test");
        logger.log(LogLevel_1.default.Info, "server starting...");
        const env = (0, getEnv_1.default)();
        const db = env.NODE_ENV == "development" ?
            yield (0, getMockupDB_1.default)() :
            yield (0, getProductionDB_1.default)();
        logger.log(LogLevel_1.default.Info, env.NODE_ENV);
        const app = (0, express_1.default)();
        app.disable("x-powered-by");
        app.use((0, cors_1.default)({ credentials: true, origin: env.DOMAIN }));
        app.use((0, cookie_parser_1.default)());
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(express_1.default.json({ reviver: JSONHelpers_1.default.parse }));
        const api = new API_1.default(db, logger.getSubLogger("API"));
        logger.log(LogLevel_1.default.Info, "starting registering paths");
        const routes = [
            books_1.Books_CancelReservation_Route,
            books_1.Books_Lend_Route,
            books_1.Books_Reserve_Route,
            books_1.Books_Return_Route,
            crud_1.CreateOneAction_Path,
            crud_1.DeleteOneAction_Path,
            crud_1.UpdateOneAction_Path,
            crud_1.GetManyAction_Path,
            crud_1.GetOneAction_Path,
            reports_1.Reports_Download_Route,
            reports_1.Reports_GetAllGenerated_Route,
            reports_1.Reports_RequestCreation_Route,
            user_1.User_ResetPassword_Route,
            user_1.User_ChangePassword_Route,
            user_1.User_Login_Route,
            user_1.User_Logout_Route,
            user_1.User_CurrentUser_Route
        ];
        for (const route of routes) {
            const { path, handler, method } = route.create(api, logger);
            const func = method == Method_1.Method.POST ? app.post.bind(app) : app.get.bind(app);
            func(path, handler);
        }
        logger.log(LogLevel_1.default.Success, "Paths registered successfully");
        if (env.NODE_ENV == "development") {
            app.use("/*", (req, res) => {
                const response = `Attempted to request non-existent path (${req.originalUrl}), valid paths (more info in documentation): 
                ${routes.map(route => route.path).join(",")} 
                ABORTING!`;
                logger.log(LogLevel_1.default.Error, response);
                res.status(StatusCode_1.default.ClientErrorBadRequest).json({
                    error: {
                        customCode: -1,
                        message: response
                    }
                });
            });
        }
        const key = fs_1.default.readFileSync(env.HTTPS_KEY);
        const cert = fs_1.default.readFileSync(env.HTTPS_CERT);
        const server = https_1.default.createServer({ key: key, cert: cert }, app);
        server.listen(env.PORT, () => {
            console.clear();
            logger.log(LogLevel_1.default.Success, `fully initialized, listens on port ${env.PORT}`);
            // testFrontend()
        });
    });
}
main();
