import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "../../packages/db-schema/src/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DIRECT_DATABASE_URL!,
	},
});
