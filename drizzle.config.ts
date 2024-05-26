import { defineConfig } from 'drizzle-kit';
import getEnv from './src/getEnv';
import path from 'path';

const env = getEnv()

export default defineConfig({
    schema: './src/API/schema/*',
    out: path.join("./", env.MIGRATION_CATALOG),
    dialect: 'postgresql',
    dbCredentials: {
        host: env.DATABASE_URL,
        port: env.PORT,
        user: env.DATABASE_USER_NAME,
        password: env.DATABASE_USER_PASSWORD,
        database: env.DATABASE_NAME,
    },
});