import { Request, Response } from "express";
import { ZodType, z } from "zod";
import { Librarian } from "../DB/schema/LibrariansTable";
import API from "../API/API";
import { AuthLevel, Method } from "./Route";
import Logger from "../Logger/Logger";
import getEnv from "../getEnv";
import jwt from "jsonwebtoken"
import StatusCode from "status-code-enum";
import Period from "../utils/Period";

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

export type HandlerParsedParametersType<AuthLevelType extends AuthLevel, BodySchema extends Schema = undefined, QuerySchema extends Schema = undefined, PathSchema extends Schema = undefined> = {
    params: (BodySchema extends ZodType<any, any, any> ? z.infer<BodySchema> : {}) & (QuerySchema extends ZodType<any, any, any> ? z.infer<QuerySchema> : {}),
    pathsParams: PathSchema extends ZodType<any, any, any> ? z.infer<PathSchema> : {},
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

export type CreateRouteArgument<AuthLevelType extends AuthLevel, DataType, CustomErrorType, BodySchema extends Schema = undefined, QuerySchema extends Schema = undefined, PathSchema extends Schema = undefined> = {
    bodySchema: BodySchema
    querySchema: QuerySchema
    pathSchema: PathSchema
    handler: (arg: HandlerParsedParametersType<AuthLevelType, BodySchema, QuerySchema, PathSchema>) => Promise<HandlerResponse<DataType, CustomErrorType>>
    method: Method
    authLevel: AuthLevelType
}

async function getLoggedInUser(req: Request, secretAccessToken: string, api: API): Promise<Librarian | null> {
    return new Promise<Librarian | null>(async (resolve) => {
        const accessToken = req.cookies?.accessToken as string | undefined;

        if (accessToken == null || await api.isBlacklisted(accessToken)) {
            resolve(null)
            return
        }

        jwt.verify(accessToken, secretAccessToken, async (err, decoded) => {
            if (err) {
                resolve(null)
                return
            }

            if (typeof decoded == "object") {
                api.getLibrarianById(decoded.id).then(resolve)
            } else {
                resolve(null)
            }
        });
    })
}

export default function createRoute<AuthLevelType extends AuthLevel, DataType extends {}, CustomErrorType, BodySchema extends Schema = undefined, QuerySchema extends Schema = undefined, PathSchema extends Schema = undefined>(
    { bodySchema, querySchema, pathSchema, handler, method, authLevel }: CreateRouteArgument<AuthLevelType, DataType, CustomErrorType, BodySchema, QuerySchema, PathSchema>
) {
    return (api: API, logger: Logger) => {
        return {
            method,
            async handler(req: Request, res: Response) {
                const { SECRET_ACCESS_TOKEN } = getEnv()

                const loggedInUser = await getLoggedInUser(req, SECRET_ACCESS_TOKEN, api)
                if (loggedInUser == null && authLevel == AuthLevel.Librarian) {
                    return res
                        .status(StatusCode.ClientErrorUnauthorized)
                        .json({ message: "This session has expired. Please login" });
                }

                //parsing data if any
                let parsedParams: (BodySchema extends ZodType<any, any, any> ? z.infer<BodySchema> : {}) & (QuerySchema extends ZodType<any, any, any> ? z.infer<QuerySchema> : {})
                try {
                    const parsedBody = bodySchema?.parse(req.body) ?? {}
                    const parsedQuery = querySchema?.parse(req.query) ?? {}

                    parsedParams = {
                        ...parsedBody,
                        ...parsedQuery
                    }
                } catch {
                    return res
                        .status(StatusCode.ClientErrorBadRequest)
                        .json({ message: "Invalid parameters provided" })
                }

                const result = await handler({
                    params: parsedParams,
                    api,
                    pathsParams: pathSchema?.parse(req.params) ?? {},
                    user: loggedInUser == null ? {
                        user: null,
                        async login(email: string, password: string) {
                            return api.getLibrarian(email, password).then(librarian => {
                                if (librarian == null) {
                                    return null
                                }

                                const token = jwt.sign({ id: librarian.id }, SECRET_ACCESS_TOKEN, {
                                    expiresIn: '24h',
                                });

                                res.cookie("SessionID", token, {
                                    maxAge: Period.Day, // would expire in 24hours
                                    httpOnly: true, // The cookie is only accessible by the web server
                                    secure: true,
                                    sameSite: "none",
                                });

                                return librarian
                            })
                        }
                    } : {
                        user: loggedInUser,
                        async logout() {
                            try {
                                const accessToken = req.cookies?.accessToken
                                if (accessToken == null || !await api.isBlacklisted(accessToken)) {
                                    return false
                                }

                                await api.addToBlacklist(accessToken)

                                return true
                            } catch (err) {
                                return false
                            }
                        }
                    } as any,
                    logger,
                    _native: {
                        req,
                        res
                    }
                })

                if (result.data != null) {
                    res.status(StatusCode.SuccessOK).json(result.data)
                } else {
                    res.status(result.error?.code as number).send(result.error?.message)
                }
            }
        }
    }
}