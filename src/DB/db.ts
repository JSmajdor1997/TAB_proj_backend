import { PgliteDatabase } from "drizzle-orm/pglite"
import { PostgresJsDatabase } from "drizzle-orm/postgres-js"

type DB = PgliteDatabase<Record<string, never>> | PostgresJsDatabase<Record<string, never>>

export default DB