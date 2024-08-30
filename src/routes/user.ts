import { z } from "zod"
import { AuthLevel } from "./createRoute/AuthLevel"
import { Method } from "./createRoute/Method"
import createRoute from "./createRoute/createRoute"
import StatusCode from "../utils/StatusCode"

enum SettingPasswordError {
    InvalidOldPasswordProvided = 0
}

enum LoginError {
    UserAlreadyLoggedIn = 0,
    UserDoesNotExistOrInvalidPassword = 1
}

export const User_CurrentUser_Route = createRoute("/user/current-user", {
    method: Method.POST,
    authLevel: AuthLevel.AnyAuthorized,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ api, user }) {
        return {
            data: {
                id: user.user.id,
                userType: user.user.userType
            }
        }
    },
})

export const User_ResetPassword_Route = createRoute("/user/reset-password", {
    method: Method.POST,
    authLevel: AuthLevel.None,
    bodySchema: z.object({
        email: z.string(),
    }),
    querySchema: undefined,
    async handler({ params: { email }, api, user }) {
        console.log(user)
        // throw new Error("ToDo")
        return {
            data: "ToDo!"
        }
    },
})

export const User_ChangePassword_Route = createRoute("/user/change-password", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: z.object({
        oldPassword: z.string(),
        newPassword: z.string()
    }),
    querySchema: undefined,
    async handler({ params: { oldPassword, newPassword }, api, user }) {
        //jeśli hasło - tylko jeśli to my
        if (await api.getLibrarian({ email: user.user.email, password: oldPassword }) == null) {
            return {
                error: {
                    code: StatusCode.ClientErrorBadRequest,
                    customCode: SettingPasswordError.InvalidOldPasswordProvided,
                    message: "Invalid old password provided"
                }
            }
        }

        await api.setPassword(user.user, newPassword)

        return {
            data: "OK"
        }
    },
})

export const User_Login_Route = createRoute("/user/login", {
    method: Method.POST,
    authLevel: AuthLevel.None,
    bodySchema: z.object({
        email: z.string().email(),
        password: z.string(),
        userType: z.union([z.literal(AuthLevel.Student), z.literal(AuthLevel.Librarian)]),
    }),
    querySchema: undefined,
    async handler({ params, user }) {
        if (user.user != null) {
            return {
                error: {
                    code: StatusCode.ClientErrorBadRequest,
                    customCode: LoginError.UserAlreadyLoggedIn,
                    message: "User already logged in!"
                }
            }
        } else {
            const result = await user.login(params.userType, params.email, params.password)
            if (result == null) {
                return {
                    error: {
                        code: StatusCode.ClientErrorBadRequest,
                        customCode: LoginError.UserDoesNotExistOrInvalidPassword,
                        message: "User does not exist or invalid password provided"
                    }
                }
            }

            return {
                data: {
                    user: {
                        ...result,
                        password: undefined
                    }
                }
            }
        }
    },
})

export const User_Logout_Route = createRoute("/user/logout", {
    method: Method.POST,
    authLevel: AuthLevel.Librarian,
    bodySchema: undefined,
    querySchema: undefined,
    async handler({ user }) {
        if (await user.logout()) {
            return {
                data: "User logged out successfully"
            }
        }

        return {
            error: {
                code: StatusCode.ServerErrorInternal,
                message: "Unknown error occurred"
            }
        }
    },
})