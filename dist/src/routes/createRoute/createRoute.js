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
const getEnv_1 = __importDefault(require("../../getEnv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Period_1 = __importDefault(require("../../utils/Period"));
const AuthLevel_1 = require("./AuthLevel");
const LogLevel_1 = __importDefault(require("../../Logger/LogLevel"));
const StatusCode_1 = __importDefault(require("../../utils/StatusCode"));
const isLibrarian_1 = __importDefault(require("../../DB/type_guards/isLibrarian"));
const JSONHelpers_1 = __importDefault(require("../../utils/JSONHelpers"));
function getLoggedInUser(req, secretAccessToken, api) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
            if (accessToken == null) {
                resolve(null);
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(accessToken, secretAccessToken);
            if (typeof decoded == "object") {
                if (decoded.userType == AuthLevel_1.AuthLevel.Librarian) {
                    api.getLibrarian({ id: decoded.id }).then(resolve);
                }
                else if (decoded.userType == AuthLevel_1.AuthLevel.Student) {
                    api.getStudent({ id: decoded.id }).then(resolve);
                }
                else {
                    resolve(null);
                }
            }
            else {
                resolve(null);
            }
        }));
    });
}
function createRoute(path, { bodySchema, querySchema, handler, method, authLevel }) {
    return {
        path,
        create: (api, logger) => {
            const pathHandlerLogger = logger.getSubLogger("Path handler HOC").getSubLogger(path);
            return {
                path,
                method,
                handler(req, res) {
                    return __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d, _e;
                        pathHandlerLogger.log(LogLevel_1.default.Info, `Requested path`);
                        const { SECRET_ACCESS_TOKEN } = (0, getEnv_1.default)();
                        const loggedInUser = yield getLoggedInUser(req, SECRET_ACCESS_TOKEN, api);
                        if (loggedInUser == null && authLevel == AuthLevel_1.AuthLevel.Librarian) {
                            pathHandlerLogger.log(LogLevel_1.default.Error, `Session has expired`);
                            return res
                                .status(StatusCode_1.default.ClientErrorUnauthorized)
                                .json({ message: "This session has expired. Please login" });
                        }
                        pathHandlerLogger.log(LogLevel_1.default.Info, `Valid auth - user = ${loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.email}`);
                        //parsing data if any
                        let parsedParams;
                        try {
                            const parsedBody = (_a = bodySchema === null || bodySchema === void 0 ? void 0 : bodySchema.parse(req.body)) !== null && _a !== void 0 ? _a : {};
                            const parsedQuery = (_b = querySchema === null || querySchema === void 0 ? void 0 : querySchema.parse(req.query)) !== null && _b !== void 0 ? _b : {};
                            parsedParams = Object.assign(Object.assign({}, parsedBody), parsedQuery);
                        }
                        catch (exc) {
                            pathHandlerLogger.log(LogLevel_1.default.Error, `Parsing params failed, aborting, ${exc.toString()}`);
                            return res
                                .status(StatusCode_1.default.ClientErrorBadRequest)
                                .json({ message: "Invalid parameters provided" });
                        }
                        const result = yield handler({
                            params: parsedParams,
                            api,
                            pathsParams: req.params,
                            user: loggedInUser == null ? {
                                user: null,
                                login(userType, email, password) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        pathHandlerLogger.log(LogLevel_1.default.Info, `Requested login`);
                                        // user: AuthLevelType extends AuthLevel.None ? {
                                        //     user: null,
                                        //     login<T extends AuthLevel.Librarian | AuthLevel.Student>(userType: T, email: string, password: string): Promise<(T extends AuthLevel.Librarian ? Librarian : Student) | null>
                                        // } : {
                                        //     user: Librarian | Student,
                                        //     logout(): Promise<boolean>
                                        // },
                                        const getter = userType == AuthLevel_1.AuthLevel.Librarian ?
                                            api.getLibrarian :
                                            api.getStudent;
                                        return getter({ email, password }).then(user => {
                                            if (user == null) {
                                                pathHandlerLogger.log(LogLevel_1.default.Error, `Invalid auth provided`);
                                                return null;
                                            }
                                            const token = jsonwebtoken_1.default.sign({ id: user.id, userType }, SECRET_ACCESS_TOKEN, {
                                                expiresIn: '24h',
                                            });
                                            res.cookie("jwt", token, {
                                                maxAge: Period_1.default.Day, // would expire in 24hours
                                                httpOnly: true, // The cookie is only accessible by the web server
                                                secure: true,
                                                sameSite: "none"
                                            });
                                            pathHandlerLogger.log(LogLevel_1.default.Success, `Valid auth provided | logged in`);
                                            return user;
                                        });
                                    });
                                }
                            } : {
                                user: Object.assign(Object.assign({}, loggedInUser), { userType: (0, isLibrarian_1.default)(loggedInUser) ? AuthLevel_1.AuthLevel.Librarian : AuthLevel_1.AuthLevel.Student }),
                                logout() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        var _a;
                                        pathHandlerLogger.log(LogLevel_1.default.Info, `Logout requested`);
                                        try {
                                            const jwt = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
                                            if (jwt == null) {
                                                pathHandlerLogger.log(LogLevel_1.default.CriticalError, `User not logged in, aborting`);
                                                return false;
                                            }
                                            res.cookie('jwt', '', { maxAge: 1, sameSite: "none", httpOnly: true });
                                            res.clearCookie('jwt');
                                            pathHandlerLogger.log(LogLevel_1.default.Success, `Logout successful`);
                                            return true;
                                        }
                                        catch (err) {
                                            return false;
                                        }
                                    });
                                }
                            },
                            logger: pathHandlerLogger,
                            _native: {
                                req,
                                res
                            }
                        });
                        if (result.data != null) {
                            res.set("Access-Control-Expose-Headers", "Authorization");
                            res.status(StatusCode_1.default.SuccessOK).send(JSON.stringify(yield result.data, JSONHelpers_1.default.stringify));
                        }
                        else {
                            res.status((_c = result.error) === null || _c === void 0 ? void 0 : _c.code).send({
                                message: (_d = result.error) === null || _d === void 0 ? void 0 : _d.message,
                                customCode: (_e = result.error) === null || _e === void 0 ? void 0 : _e.customCode
                            });
                        }
                    });
                }
            };
        }
    };
}
exports.default = createRoute;
