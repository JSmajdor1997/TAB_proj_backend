import mysql from "mysql2/promise";  // Use mysql2 with promises for async/await support
import getEnv from "../getEnv"
import { drizzle } from "drizzle-orm/mysql2";

export default async function getProductionDB() {
    const env = getEnv()

    const connection = await mysql.createPool({
        host: env.DATABASE_URL,
        port: env.DATABASE_PORT,
        user: env.DATABASE_USER_NAME,
        password: env.DATABASE_USER_PASSWORD,
        database: env.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return drizzle(connection)
}