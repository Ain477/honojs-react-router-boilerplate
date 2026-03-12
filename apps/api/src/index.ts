import { auth } from "@api/lib/auth";
import { betterAuthMiddleware } from "@api/middleware/auth";
import router from "@api/modules";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono()
	.use(contextStorage())
	.use("*", requestId())
	.use(secureHeaders())
	.use(
		"*",
		cors({
			origin: (origin, _c) => {
				return origin;
			},
			maxAge: 600,
			credentials: true,
		}),
	)
	.use(
		bodyLimit({
			maxSize: 1024 * 1024 * 10, // 10MB
			onError: ({ error }) => {
				console.warn(
					{ error: error?.message },
					"Tried to send too large of a body",
				);
				throw new Error("Ops! I can't handle this much data!");
			},
		}),
	)
	.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
	.use(betterAuthMiddleware)
	.onError((err, c) => {
		if (err instanceof HTTPException) {
			return c.json(
				{
					success: false,
					error: {
						code: "http_exception",
						message: err.message || "An unexpected error occurred.",
						details: err.getResponse() || {},
					},
				},
				err.status,
			);
		}
		return c.json(
			{
				success: false,
				error: {
					code: "internal_server_error",
					message: "An unexpected error occurred.",
					details: {},
				},
			},
			500,
		);
	})
	.route("/", router);

export default app;
