/// <reference path="../../app.d.ts" />
import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";

/**
 * Create a new Hono router with context storage enabled.
 */
export function createRouter() {
	const router = new Hono<TApp>();
	router.use(contextStorage());
	return router;
}
