import postgres from "postgres"
import getEnv from "../getEnv"
import { drizzle } from "drizzle-orm/postgres-js"

export default async function getProductionDB() {
    const env = getEnv()

    const handle = postgres({
        host: env.DATABASE_URL,
        port: env.DATABASE_PORT,
        user: env.DATABASE_USER_NAME,
        password: env.DATABASE_USER_PASSWORD,
        database: env.DATABASE_NAME,
    })

    return drizzle(handle)
}