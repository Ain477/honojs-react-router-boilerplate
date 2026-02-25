import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
	schema: "../../packages/db-schema/src/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DIRECT_DATABASE_URL,
	},
});
