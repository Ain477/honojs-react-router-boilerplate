import type { Context } from "hono";
import { getContext as getHonoContext } from "hono/context-storage";

/**
 * Get the current Hono context.
 * Requires `contextStorage()` middleware to be registered.
 */
export function getContext(): Context<TApp> {
	return getHonoContext<TApp>();
}
