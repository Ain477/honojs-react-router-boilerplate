import { createRouter } from "@/utils/router";

const router = createRouter()
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})

export default router;
export type RoutersType = typeof router;
