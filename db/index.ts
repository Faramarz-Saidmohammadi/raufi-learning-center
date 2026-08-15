import { drizzle } from "drizzle-orm/d1";
import { getRuntimeEnv } from "@/lib/runtime-env";
import * as schema from "./schema";

export async function getDb() {
  const env=await getRuntimeEnv();
  const database=env.DB as Parameters<typeof drizzle>[0]|undefined;
  if (!database) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Configure the database binding before starting the application."
    );
  }

  return drizzle(database, { schema });
}
