import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { dbSchema, tableValidationSchema } from "@repo/db-schema";
import { env } from "@/config/env";



/**
 * Get database instance.
 *
 * A fresh connection is created per call because Cloudflare Workers isolates
 * I/O objects per request — a connection opened in one request handler cannot
 * be reused in another (the underlying writable stream is request-scoped).
 */
export default function getDB() {
	const dbUrl = env.DIRECT_DATABASE_URL;

	if (!dbUrl) {
		throw new Error(
			"Database binding not found. Ensure you are within a request context and 'db' binding is available.",
		);
	}

    const queryClient = postgres(env.DIRECT_DATABASE_URL);
    const db = drizzle(queryClient, { schema: dbSchema });

	return db;
}

export { dbSchema, tableValidationSchema };
