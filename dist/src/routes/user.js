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
exports.User_Logout_Route = exports.User_Login_Route = exports.User_ChangePassword_Route = exports.User_ResetPassword_Route = exports.User_CurrentUser_Route = void 0;
const zod_1 = require("zod");
const AuthLevel_1 = require("./createRoute/AuthLevel");
const Method_1 = require("./createRoute/Method");
const createRoute_1 = __importDefault(require("./createRoute/createRoute"));
const StatusCode_1 = __importDefault(require("../utils/StatusCode"));
var SettingPasswordError;
(function (SettingPasswordError) {
    SettingPasswordError[SettingPasswordError["InvalidOldPasswordProvided"] = 0] = "InvalidOldPasswordProvided";
})(SettingPasswordError || (SettingPasswordError = {}));
var LoginError;
(function (LoginError) {
    LoginError[LoginError["UserAlreadyLoggedIn"] = 0] = "UserAlreadyLoggedIn";
    LoginError[LoginError["UserDoesNotExistOrInvalidPassword"] = 1] = "UserDoesNotExistOrInvalidPassword";
})(LoginError || (LoginError = {}));
exports.User_CurrentUser_Route = (0, createRoute_1.default)("/user/current-user", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.AnyAuthorized,
    bodySchema: undefined,
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ api, user }) {
            return {
                data: {
                    id: user.user.id,
                    userType: user.user.userType
                }
            };
        });
    },
});
exports.User_ResetPassword_Route = (0, createRoute_1.default)("/user/reset-password", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.None,
    bodySchema: zod_1.z.object({
        email: zod_1.z.string(),
    }),
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params: { email }, api, user }) {
            console.log(user);
            // throw new Error("ToDo")
            return {
                data: "ToDo!"
            };
        });
    },
});
exports.User_ChangePassword_Route = (0, createRoute_1.default)("/user/change-password", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: zod_1.z.object({
        oldPassword: zod_1.z.string(),
        newPassword: zod_1.z.string()
    }),
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params: { oldPassword, newPassword }, api, user }) {
            //jeśli hasło - tylko jeśli to my
            if ((yield api.getLibrarian({ email: user.user.email, password: oldPassword })) == null) {
                return {
                    error: {
                        code: StatusCode_1.default.ClientErrorBadRequest,
                        customCode: SettingPasswordError.InvalidOldPasswordProvided,
                        message: "Invalid old password provided"
                    }
                };
            }
            yield api.setPassword(user.user, newPassword);
            return {
                data: "OK"
            };
        });
    },
});
exports.User_Login_Route = (0, createRoute_1.default)("/user/login", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.None,
    bodySchema: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
        userType: zod_1.z.union([zod_1.z.literal(AuthLevel_1.AuthLevel.Student), zod_1.z.literal(AuthLevel_1.AuthLevel.Librarian)]),
    }),
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, user }) {
            console.log(params);
            if (user.user != null) {
                return {
                    error: {
                        code: StatusCode_1.default.ClientErrorBadRequest,
                        customCode: LoginError.UserAlreadyLoggedIn,
                        message: "User already logged in!"
                    }
                };
            }
            else {
                const result = yield user.login(params.userType, params.email, params.password);
                if (result == null) {
                    return {
                        error: {
                            code: StatusCode_1.default.ClientErrorBadRequest,
                            customCode: LoginError.UserDoesNotExistOrInvalidPassword,
                            message: "User does not exist or invalid password provided"
                        }
                    };
                }
                return {
                    data: {
                        user: Object.assign(Object.assign({}, result), { password: undefined })
                    }
                };
            }
        });
    },
});
exports.User_Logout_Route = (0, createRoute_1.default)("/user/logout", {
    method: Method_1.Method.POST,
    authLevel: AuthLevel_1.AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    handler(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user }) {
            if (yield user.logout()) {
                return {
                    data: "User logged out successfully"
                };
            }
            return {
                error: {
                    code: StatusCode_1.default.ServerErrorInternal,
                    message: "Unknown error occurred"
                }
            };
        });
    },
});
