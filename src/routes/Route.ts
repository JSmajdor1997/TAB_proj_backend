import { Request, Response } from "express";
import Logger from "../Logger/Logger";
import DB from "../DB/DB";

export enum AuthLevel {
    Librarian,
    None
}

export enum Method {
    GET,
    POST
}

//handler bierze:
/**
 * bazę danych
 * logger
 * sparsowane dane lub błąd odpowiedni
 */

export type Handler = (req: Request, res: Response, db: DB, logger: Logger["log"]) => void

export default class Route {
    constructor(
        public readonly method: Method,
        public readonly authType: AuthLevel,
        public readonly basePath: string,
        public readonly handler: Handler
    ) { }
}