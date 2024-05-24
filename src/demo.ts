import { db } from "./DB/db";
import * as schema from "./DB/schema";

(async () => {
    const users = await db.select().from(schema.users);
    console.log(users);
    process.exit(0);
})();