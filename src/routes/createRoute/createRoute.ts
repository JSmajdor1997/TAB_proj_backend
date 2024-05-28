import { Request, Response } from "express";
import { ZodType, z } from "zod";
import { Librarian } from "../../DB/schema/LibrariansTable";
import API from "../../API/API";
import Logger from "../../Logger/Logger";
import getEnv from "../../getEnv";
import jwt from "jsonwebtoken"
import Period from "../../utils/Period";
import { AuthLevel } from "./AuthLevel";
import { Method } from "./Method";
import InferExpressRouteParams from "../../utils/InferExpressRouteParams";
import LogLevel from "../../Logger/LogLevel";
import StatusCode from "../../utils/StatusCode";

export type HandlerResponse<DataType, CustomErrorType> = {
    error: {
        code: StatusCode
        message: string
        customCode?: CustomErrorType
    }
    data?: never
} | {
    error?: never
    data: DataType
}

export type Schema = ZodType<any, any, any> | undefined

export type HandlerParsedParametersType<AuthLevelType extends AuthLevel, PathType, BodySchema extends Schema = undefined, QuerySchema extends Schema = undefined> = {
    params: (BodySchema extends ZodType<any, any, any> ? z.infer<BodySchema> : {}) & (QuerySchema extends ZodType<any, any, any> ? z.infer<QuerySchema> : {}),
    pathsParams: PathType,
    user: AuthLevelType extends AuthLevel.Librarian ? {
        user: Librarian,
        logout(): Promise<boolean>
    } : {
        user: null,
        login(email: string, password: string): Promise<Librarian | null>
    },
    api: API
    logger: Logger
    _native: {
        req: Request
        res: Response
    }
}

export type CreateRouteArgument<Path extends string, AuthLevelType extends AuthLevel, DataType, CustomErrorType, BodySchema extends Schema = undefined, QuerySchema extends Schema = undefined> = {
    bodySchema: BodySchema
    querySchema: QuerySchema
    handler: (arg: HandlerParsedParametersType<AuthLevelType, InferExpressRouteParams<Path>, BodySchema, QuerySchema>) => Promise<HandlerResponse<DataType, CustomErrorType>>
    method: Method
    authLevel: AuthLevelType
}

async function getLoggedInUser(req: Request, secretAccessToken: string, api: API): Promise<Librarian | null> {
    return new Promise<Librarian | null>(async (resolve) => {
        const accessToken = req.cookies?.jwt as string | undefined;
        if (accessToken == null) {
            resolve(null)
            return
        }

        const decoded = jwt.verify(accessToken, secretAccessToken)
        if (typeof decoded == "object") {
            api.getLibrarian({id: decoded.id}).then(resolve)
        } else {
            resolve(null)
        }
    })
}

export default function createRoute<Path extends string, AuthLevelType extends AuthLevel, DataType extends {}, CustomErrorType, BodySchema extends Schema = undefined, QuerySchema extends Schema = undefined>(
    path: Path, { bodySchema, querySchema, handler, method, authLevel }: CreateRouteArgument<Path, AuthLevelType, DataType, CustomErrorType, BodySchema, QuerySchema>
) {
    return {
        path,
        create: (api: API, logger: Logger) => {
            const pathHandlerLogger = logger.getSubLogger("Path handler HOC").getSubLogger(path)
            
            return {
                path,
                method,
                async handler(req: Request, res: Response) {
                    pathHandlerLogger.log(LogLevel.Info, `Requested path`)
    
                    const { SECRET_ACCESS_TOKEN } = getEnv()
    
                    const loggedInUser = await getLoggedInUser(req, SECRET_ACCESS_TOKEN, api)
                    if (loggedInUser == null && authLevel == AuthLevel.Librarian) {
                        pathHandlerLogger.log(LogLevel.Error, `Session has expired`)
    
                        return res
                            .status(StatusCode.ClientErrorUnauthorized)
                            .json({ message: "This session has expired. Please login" });
                    }
    
                    pathHandlerLogger.log(LogLevel.Info, `Valid auth - user = ${loggedInUser?.email}`)
    
                    //parsing data if any
                    let parsedParams: (BodySchema extends ZodType<any, any, any> ? z.infer<BodySchema> : {}) & (QuerySchema extends ZodType<any, any, any> ? z.infer<QuerySchema> : {})
                    try {
                        const parsedBody = bodySchema?.parse(req.body) ?? {}
                        const parsedQuery = querySchema?.parse(req.query) ?? {}
    
                        parsedParams = {
                            ...parsedBody,
                            ...parsedQuery
                        }
                    } catch(exc) {
                        pathHandlerLogger.log(LogLevel.Error, `Parsing params failed, aborting, ${(exc as string).toString()}`)
    
                        return res
                            .status(StatusCode.ClientErrorBadRequest)
                            .json({ message: "Invalid parameters provided" })
                    }
    
                    const result = await handler({
                        params: parsedParams,
                        api,
                        pathsParams: req.params as any,
                        user: loggedInUser == null ? {
                            user: null,
                            async login(email: string, password: string) {
                                pathHandlerLogger.log(LogLevel.Info, `Requested login`)
    
                                return api.getLibrarian({email, password}).then(librarian => {
                                    if (librarian == null) {
                                        pathHandlerLogger.log(LogLevel.Error, `Invalid auth provided`)
    
                                        return null
                                    }
    
                                    const token = jwt.sign({ id: librarian.id }, SECRET_ACCESS_TOKEN, {
                                        expiresIn: '24h',
                                    });
    
                                    res.cookie("jwt", token, {
                                        maxAge: Period.Day, // would expire in 24hours
                                        // httpOnly: true, // The cookie is only accessible by the web server
                                        secure: true,
                                    })

                                    pathHandlerLogger.log(LogLevel.Success, `Valid auth provided | loggen in`)
    
                                    return librarian
                                })
                            }
                        } : {
                            user: loggedInUser,
                            async logout() {
                                pathHandlerLogger.log(LogLevel.Info, `Logout requested`)
    
                                try {
                                    const jwt = req.cookies?.jwt
                                    if (jwt == null) {
                                        pathHandlerLogger.log(LogLevel.CriticalError, `User not logged in, aborting`)
    
                                        return false
                                    }
    
                                    res.cookie('jwt', '', {maxAge: 1})

                                    pathHandlerLogger.log(LogLevel.Success, `Logout successful`)
    
                                    return true
                                } catch (err) {
                                    return false
                                }
                            }
                        } as any,
                        logger: pathHandlerLogger,
                        _native: {
                            req,
                            res
                        }
                    })
    
                    if (result.data != null) {
                        res.status(StatusCode.SuccessOK).json(result.data)
                    } else {
                        res.status(result.error?.code as number).send({
                            message: result.error?.message,
                            customCode: result.error?.customCode
                        })
                    }
                }
            }
        }
    }
}