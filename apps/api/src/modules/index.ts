import { createRouter } from "@api/utils/router";
import i18nRouter from "./i18n/routes";

const router = createRouter()
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.route("/locales", i18nRouter);

export default router;
export type RoutersType = typeof router;
