import type { Context, Next } from "hono";
import { getUserId as getUserIdFromContext } from "@/context/user";
import { getAuth, type TAuth } from "@/lib/auth";

type SessionUser = TAuth["$Infer"]["Session"]["user"];
type SessionData = TAuth["$Infer"]["Session"]["session"];

export interface AuthContext {
	user: SessionUser | null;
	session: SessionData | null;
}

/**
 * Better Auth session middleware.
 * Extracts session from request headers and attaches user/session to Hono context.
 */
export const betterAuthMiddleware = async (c: Context, next: Next) => {
	const session = await getAuth().api.getSession({
		headers: c.req.raw.headers,
	});
	console.log(
		`[AuthMiddleware] Session check for ${c.req.path}:`,
		session ? "Found" : "Missing",
	);

	c.set("user", session?.user ?? null);
	c.set("session", session?.session ?? null);

	await next();
};

/**
 * Require authentication — returns 401 if no session exists.
 */
export const requireAuth = async (c: Context, next: Next) => {
	// Allow OPTIONS requests for CORS preflight
	if (c.req.method === "OPTIONS") {
		await next();
		return;
	}

	const user = c.get("user");
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401);
	}
	await next();
};

/** Get the authenticated user's ID from context. Throws if not authenticated. */
export const getUserId = getUserIdFromContext;
