import express, { Express, Request, Response } from "express";
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
import { BookItems_Lend_Route, BookItems_Return_Route } from "./routes/book-items";
import { Messages_Get_Route, Messages_Send_Route } from "./routes/messages";
import { Method } from "./routes/createRoute/Method";
import { ObjectActionCrud_Path } from "./routes/object-action-crud";
import { Reports_Download_Route, Reports_GetAllGenerated_Route, Reports_RequestCreation_Route } from "./routes/reports";
import { User_ResetPassword_Route, User_ChangePassword_Route, User_Login_Route, User_Logout_Route } from "./routes/user";
import StatusCode from "./utils/StatusCode";
import fs from "fs"
import https from "https"

dotenv.config();

async function main() {
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
    app.use(express.json());

    const api = new API(db, logger.getSubLogger("API"))

    logger.log(LogLevel.Info, "starting registering paths")

    const routes = [
        BookItems_Lend_Route,
        BookItems_Return_Route,

        Messages_Send_Route,
        Messages_Get_Route,

        Reports_Download_Route,
        Reports_GetAllGenerated_Route,
        Reports_RequestCreation_Route,

        User_ResetPassword_Route,
        User_ChangePassword_Route,
        User_Login_Route,
        User_Logout_Route,

        ObjectActionCrud_Path
    ]

    for (const route of routes) {
        const { path, handler, method } = route.create(api, logger)
        const func = method == Method.POST ? app.post.bind(app) : app.get.bind(app)

        func(path, handler)
    }

    logger.log(LogLevel.Success, "Paths registered successfully")

    app.get("/sraka", (req, res) => {
        console.log(req.cookies)
        console.log(req.signedCookies)
        res.cookie("myka", "bykja", {
            httpOnly: true,
            secure: true
        })
        res.send("siema")
    })

    if (env.NODE_ENV == "development") {
        app.get("/*", (req, res) => {
            const response = `Attempted to request non-existent path, valid paths (more info in documentation): ${routes.map(route => route.path).join(", ")}`
            logger.log(LogLevel.Error, response)

            res.status(StatusCode.ClientErrorBadRequest).json({
                error: {
                    customCode: -1,
                    message: response
                }
            })
        })

        app.post("/*", (req, res) => {
            const response = `Attempted to request non-existent path, valid paths (more info in documentation): ${routes.map(route => route.path).join(", ")}`
            logger.log(LogLevel.Error, response)

            res.status(StatusCode.ClientErrorBadRequest).json({
                error: {
                    customCode: -1,
                    message: response
                }
            })
        })
    }

    const key = fs.readFileSync("https/key.pem")
    const cert = fs.readFileSync("https/cert.pem")
    const server = https.createServer({key: key, cert: cert }, app);

    server.listen(env.PORT, () => {
        console.clear()
        logger.log(LogLevel.Success, `fully initialized, listens on port ${env.PORT}`)
    });
}

main()