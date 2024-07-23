import express, { Request, Response } from "express";
import dotenv from "dotenv";
import getMockupDB from "./DB/getMockupDB";
import getProductionDB from "./DB/getProductionDB";
import getEnv from "./getEnv";
import Logger from "./Logger/Logger";
import LogLevel from "./Logger/LogLevel";
import DB from "./DB/DB";
import cors from "cors";
import cookieParser from "cookie-parser";
import API from "./API/API";
import { Method } from "./routes/createRoute/Method";
import { Reports_Download_Route, Reports_GetAllGenerated_Route, Reports_RequestCreation_Route } from "./routes/reports";
import { User_ResetPassword_Route, User_ChangePassword_Route, User_Login_Route, User_Logout_Route, User_CurrentUser_Route } from "./routes/user";
import StatusCode from "./utils/StatusCode";
import fs from "fs"
import https from "https"
import { Books_CancelReservation_Route, Books_Lend_Route, Books_Reserve_Route, Books_Return_Route } from "./routes/books";
import { CreateOneAction_Path, DeleteOneAction_Path, UpdateOneAction_Path, GetManyAction_Path, GetOneAction_Path } from "./routes/crud";
import { Messages_SendMessage_Route, Messages_GetMessages_Route } from "./routes/messages";
import testFrontend from "./testFrontEnd";
import JSONHelpers from "./utils/JSONHelpers";

dotenv.config();

async function main() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


    const logger = new Logger(["server"])

    logger.log(LogLevel.Info, "console test")
    logger.log(LogLevel.Success, "console test")
    logger.log(LogLevel.Warning, "console test")
    logger.log(LogLevel.Error, "console test")
    logger.log(LogLevel.CriticalError, "console test")

    logger.log(LogLevel.Info, "server starting...")

    const env = getEnv()

    const db: DB = env.NODE_ENV == "development" ?
        await getMockupDB() :
        await getProductionDB()

    const app = express();
    app.disable("x-powered-by");
    app.use(cors())
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json({reviver: JSONHelpers.parse}));

    const api = new API(db, logger.getSubLogger("API"))

    logger.log(LogLevel.Info, "starting registering paths")

    const routes = [
        Books_CancelReservation_Route,
        Books_Lend_Route,
        Books_Reserve_Route,
        Books_Return_Route,

        CreateOneAction_Path,
        DeleteOneAction_Path,
        UpdateOneAction_Path,
        GetManyAction_Path,
        GetOneAction_Path,

        Messages_SendMessage_Route,
        Messages_GetMessages_Route,

        Reports_Download_Route,
        Reports_GetAllGenerated_Route,
        Reports_RequestCreation_Route,

        User_ResetPassword_Route,
        User_ChangePassword_Route,
        User_Login_Route,
        User_Logout_Route,
        User_CurrentUser_Route
    ]

    for (const route of routes) {
        const { path, handler, method } = route.create(api, logger)
        const func = method == Method.POST ? app.post.bind(app) : app.get.bind(app)

        func(path, handler)
    }

    logger.log(LogLevel.Success, "Paths registered successfully")

    if (env.NODE_ENV == "development") {
        app.use("/*", (req: Request, res: Response) => {
            const response = `Attempted to request non-existent path (${req.originalUrl}), valid paths (more info in documentation): 
                ${routes.map(route => route.path).join(",")} 
                ABORTING!`
            logger.log(LogLevel.Error, response)

            res.status(StatusCode.ClientErrorBadRequest).json({
                error: {
                    customCode: -1,
                    message: response
                }
            })
        })
    }

    const key = fs.readFileSync(env.HTTPS_KEY)
    const cert = fs.readFileSync(env.HTTPS_CERT)
    const server = https.createServer({ key: key, cert: cert }, app);

    server.listen(env.PORT, () => {
        console.clear()
        logger.log(LogLevel.Success, `fully initialized, listens on port ${env.PORT}`)

        // testFrontend()
    });
}

main()