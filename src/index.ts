import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import getMockupDB from "./DB/getMockupDB";
import getProductionDB from "./DB/getProductionDB";
import getEnv from "./getEnv";
import Logger from "./Logger/Logger";
import LogLevel from "./Logger/LogLevel";
import Route, { AuthType, Method } from "./routes/Route";
import DB from "./DB/DB";

dotenv.config();

const routes: Route[] = [
    new Route(Method.GET, AuthType.None, "/", (req, res, db, log) => {
        log(LogLevel.Info, "route", "SIEMA")

        res.send("WITAM")
    })
]

async function main() {
    const env = getEnv()

    const db: DB = env.NODE_ENV == "development" ?
        await getMockupDB() :
        await getProductionDB()

    const logger = new Logger([LogLevel.Error, LogLevel.Info])

    const app = express();

    for (const route of routes) {
        const func = route.method == Method.GET ?
            app.get.bind(app) :
            app.post.bind(app)

        func(route.basePath, (req, res) => route.handler(req, res, db, logger.log.bind(logger)))
    }

    app.listen(env.PORT, () => {
        logger.log(LogLevel.Info, "server", `fully initialized, listens on port ${env.PORT}`)
    });
}

main()