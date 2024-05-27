export interface Environment {
    PORT: number

    DATABASE_URL: string
    DATABASE_PORT: number
    DATABASE_NAME: string
    DATABASE_USER_NAME: string
    DATABASE_USER_PASSWORD: string

    NODE_ENV: "development" | "production"

    MIGRATION_CATALOG: string

    SECRET_ACCESS_TOKEN: string
}

export default function getEnv(): Environment {
    return process.env as any as Environment
}