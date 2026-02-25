import type { PgTable } from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";

const createSchema = <T extends PgTable>(table: T) => ({
	insert: createInsertSchema(table),
	select: createSelectSchema(table),
	update: createUpdateSchema(table),
});

export { createSchema };
