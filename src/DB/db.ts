import { PgliteDatabase } from "drizzle-orm/pglite"
import { MySql2Database } from "drizzle-orm/mysql2";

type DB = PgliteDatabase<Record<string, never>> | MySql2Database<Record<string, never>>

export default DB